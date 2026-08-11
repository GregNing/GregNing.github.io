---
layout: post
title: '別在 Docker CMD 裡跑 migration'
date: 2026-04-24 19:30
comments: true
categories: DevOps
description: 'Why alembic upgrade head / rails db:migrate in CMD deadlocks multi-replica deploys'
tags: Docker Alembic Rails Migration Deployment
reference:
  name:
    - Alembic tutorial
    - Twelve-Factor admin processes
  link:
    - https://alembic.sqlalchemy.org/en/latest/tutorial.html
    - https://12factor.net/admin-processes
---

### 反 pattern

很多 Dockerfile / docker-compose / k8s manifest 一開始會這樣寫：

```dockerfile
# Python / FastAPI
CMD ["sh", "-c", "alembic upgrade head && uvicorn app:app --host 0.0.0.0"]
```

```dockerfile
# Rails
CMD ["sh", "-c", "bundle exec rails db:migrate && bundle exec rails server"]
```

每個 container 啟動時先跑 migration 再起 service。單 replica 時看起來很合理、很方便，但只要 replica > 1 或有 rolling deploy，就會踩雷。

***

### 踩雷點 1：多 replica 同時 migrate

`replicas: 3` 的時候，k8s / ECS / Cloud Run 會**同時**啟三個 container。三個都跑：

```
alembic upgrade head
```

誰先拿到 migration 鎖 (alembic / Rails 都是用 `CREATE TABLE alembic_version` / `schema_migrations`) 誰就 run，其他兩個的狀況：

- **Alembic**：預設沒鎖 — 三個同時跑 `ALTER TABLE` 極大概率撞死 (MySQL metadata lock 互卡，或 DDL 直接衝突)。
- **Rails**：有 advisory lock，但等鎖時間可能超過 container health check timeout — 被 k8s 當作啟動失敗殺掉重啟，下一輪再重新搶 — **死循環 crashloop**。

即使勉強跑過，log 會長得像：

```
alembic.util.exc.CommandError: Can't locate revision identified by 'abc123'
```

因為 replica A 把 revision 推到 abc123，replica B/C 的 container 啟動當下讀到的 metadata 已經不是它以為的狀態，alembic 就糊掉。

***

### 踩雷點 2：rollback 時 schema 比 code 新

Deploy v2 (帶 migration)：

```
t=0  replica A:  migrate → schema v2 ✅ + 跑 v2 code ✅
t=1  replica B:  啟動 → alembic upgrade head (已經 head 了 noop) → 跑 v2 code ✅
t=2  發現 v2 有 bug，rollback 回 v1
t=3  replica A/B/C 全部回到 v1 code，但 DB schema 還在 v2
```

v1 code 對 v2 schema 能不能跑，不保證。新增欄位通常安全、DROP COLUMN 幾乎必死、NOT NULL 新欄位會炸。Migration 跟 service start 綁在一起，代表**沒有一個明確的時間點可以 decouple schema 版本跟 code 版本**，rollback 選擇就變得超難。

***

### 踩雷點 3：Health check 起不來

```dockerfile
CMD ["sh", "-c", "alembic upgrade head && uvicorn ..."]
```

大 migration 跑 10 分鐘。k8s readiness probe 預設 10 秒沒 ready 就重啟。結果是 container 重複啟動、重複**嘗試**跑 migration、從頭再來。Migration 永遠跑不完、service 永遠起不來。

***

### 正解：migration 當成 one-off job

**Pattern A：CI/CD 裡單獨跑一步**

```yaml
# .github/workflows/deploy.yml
- name: Run DB migrations
  run: |
    docker run --rm \
      -e DATABASE_URL=$DATABASE_URL \
      $IMAGE \
      alembic upgrade head

- name: Deploy service
  run: kubectl set image deployment/api api=$IMAGE
```

Migration 跑完再 deploy。一次、單點、log 清楚。

**Pattern B：Kubernetes Job**

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: migrate-${VERSION}
spec:
  backoffLimit: 0
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: migrate
        image: myapp:${VERSION}
        command: ["alembic", "upgrade", "head"]
```

Deploy pipeline 先 `kubectl apply` 這個 Job，等它結束再 deploy Deployment。

**Pattern C：init container (小心用)**

```yaml
spec:
  initContainers:
  - name: migrate
    image: myapp:${VERSION}
    command: ["alembic", "upgrade", "head"]
  containers:
  - name: api
    image: myapp:${VERSION}
```

每個 pod 啟動時跑一次 migration。解決了 health check 的問題 (init container 不計 readiness)，但**沒解決多 replica 並發 migrate** 的問題。除非你的 migration 都是 idempotent、且有外部鎖機制，否則 Pattern A/B 還是比較安全。

***

### Dockerfile 應該長怎樣

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# CMD 只負責起 service
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

**不要在 CMD 裡做任何只該發生一次的事**：migration、seed、cache warm-up、certificate fetch…… 這些都是 admin process / one-off job，跟 service process 切開。

***

### 例外：真的只有一個 replica

Hobby project、內部工具、只有一個 container 的小服務，`CMD: migrate && server` 是可以接受的簡化 — 如果你很確定**以後也不會 scale 到 >1**。一旦未來要 scale，就會踩前面三個雷，而重構時機通常挑得不好 (往往是 prod 正在燒的時候)。

***

### 小結

- Migration 跟 service start **不要放在同一個 CMD**。
- 多 replica 同時 migrate 會死在 lock / health check / schema drift。
- 正解：CI/CD step、k8s Job，migration 是 one-off admin process。
- Twelve-Factor app 第六條 (Processes) + 第十二條 (Admin processes) 講的就是這個。
