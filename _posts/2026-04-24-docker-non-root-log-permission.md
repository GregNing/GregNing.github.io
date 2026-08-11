---
layout: post
title: 'Docker container 用 non-root + log 目錄權限問題'
date: 2026-04-24 20:00
comments: true
categories: DevOps
description: 'Run as appuser, but logs fail with permission denied. How to fix.'
tags: Docker Security Permissions
reference:
  name:
    - Docker best practices - USER
    - OWASP Docker Security Cheat Sheet
  link:
    - https://docs.docker.com/develop/develop-images/instructions/#user
    - https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
---

### 為什麼 container 不該用 root 跑

預設 `docker run` 跑出來的 process UID 是 0 (root)。這帶來幾個問題：

1. **Container escape 風險**：雖然有 namespace 隔離，但萬一 runtime (containerd / runc) 有洞，root in container 比 non-root 造成的傷害大得多。
2. **掛載宿主目錄時檔案權限變 root:root**：宿主系統使用者之後要去清就要 sudo。
3. **某些 managed 平台 (OpenShift、GKE Autopilot、某些 PaaS) 根本不給 root 跑**，container 啟動直接失敗。
4. **合規**：SOC 2、ISO 27001、PCI-DSS audit 常見要求就是「container 不可以用 root」。

所以正確 pattern 是：

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# 建立 non-root user
RUN useradd --create-home --shell /bin/bash appuser
USER appuser

CMD ["uvicorn", "app:app", "--host", "0.0.0.0"]
```

但會踩到下一個坑。

***

### 典型錯誤：log 目錄寫不進去

啟動 container：

```
PermissionError: [Errno 13] Permission denied: '/app/logs/app.log'
```

或用 Python logging RotatingFileHandler 的話：

```
FileNotFoundError: [Errno 2] No such file or directory: '/app/logs'
```

原因是：

1. `COPY . .` 時那些檔案的 owner 是 **root** (build stage 跑到 `USER appuser` 之前所有東西都還是 root-owned)。
2. Application 要寫的 `/app/logs` 不存在、或存在但是 root owner、appuser 無權寫入。

***

### 正確 Dockerfile 寫法

```dockerfile
FROM python:3.12-slim

# 先建 user (固定 UID 方便 volume 權限管理)
RUN groupadd -g 1000 appuser && \
    useradd -u 1000 -g 1000 -m appuser

WORKDIR /app

# 把 WORKDIR 跟之後會 COPY 進來的東西 ownership 交給 appuser
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appuser . .

# 建 runtime 會寫入的目錄，先開好權限
RUN mkdir -p /app/logs && chown -R appuser:appuser /app/logs

USER appuser

CMD ["uvicorn", "app:app", "--host", "0.0.0.0"]
```

### 幾個要點

1. **`--chown=` 在 COPY 指令上**。比 `COPY . . && RUN chown -R appuser /app` 好很多：第二種寫法會多一層 image，而且某些檔案大時 `chown` 本身就幾十 MB 的 layer。
2. **runtime 會寫入的目錄 build time 就先建好**。log、cache、tmp、upload buffer…… 全部提前 `mkdir -p && chown`。
3. **固定 UID/GID**。如果會用 `volumes:` 掛宿主目錄，固定 UID 方便你在宿主上管權限：`chown -R 1000:1000 /host/logs`。
4. **`WORKDIR` 的 owner 一般不用特別處理**，但只要 app 要在 WORKDIR 直接寫檔 (log、sqlite dev db、webpack manifest 之類)，也要 `chown`。

***

### 把 log 改導到 stdout 才是更好的答案

上面的解法是讓 appuser 可以寫檔。但 containerized service 的最佳實踐是：**log 全部寫到 stdout / stderr**，讓 container runtime 負責收集。

```python
# Python
import logging, sys
logging.basicConfig(
    stream=sys.stdout,
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s',
)
```

```ruby
# Rails config/environments/production.rb
config.logger = ActiveSupport::Logger.new(STDOUT)
config.log_formatter = ::Logger::Formatter.new
```

這樣：

- 不用管目錄權限。
- k8s / ECS / Cloud Run 內建 log aggregation 直接收得到。
- Container 重啟時 log 不會丟 (跟容器內的 file log 不一樣)。
- 12-Factor app 第 11 條講的就是這個。

**只有要做 local debug、或應用本身要產生 audit file** (ex: ECPay 付款 log 需要留檔對帳) 才會真的寫到 file。那時候前面那段 Dockerfile 的 chown 處理就派上用場。

***

### 常見變形：alpine / distroless

Alpine base image (`python:3.12-alpine`、`node:20-alpine`) 的 `useradd` 不存在，要用 `adduser`：

```dockerfile
RUN addgroup -g 1000 appuser && \
    adduser -u 1000 -G appuser -D appuser
```

Distroless base image (`gcr.io/distroless/python3`) 裡根本沒有 shell，也沒辦法 `useradd`。Distroless 已經內建 `nonroot` user (UID 65532)：

```dockerfile
FROM gcr.io/distroless/python3
COPY --from=builder --chown=65532:65532 /app /app
USER 65532
CMD ["app.py"]
```

***

### 小結

- Container 預設 root，要主動切到 non-root user。
- Build time 就要把 runtime 會讀寫的檔案/目錄都 `--chown` 給那個 user。
- Log 寫 stdout，不要寫 file — 大部分情況下連權限問題都不會有。
- Alpine / distroless 的 user 建法不一樣，抄前先確認 base image。
