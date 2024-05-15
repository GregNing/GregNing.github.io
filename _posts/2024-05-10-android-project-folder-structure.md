---
layout: post
title: 'Android Project folder Structure'
date: 2024-05-10 22:50
comments: true
categories: Android
description: 'Android Project folder Structure with React Native'
tags: Android
reference:
  name:
    - Android Project folder Structure
    - React Native Android Directory Information and Project Structure.
  link:
    - https://www.geeksforgeeks.org/android-project-folder-structure/
    - https://hackmd.io/@Wciv3q-xTFidMecq00GnhQ/BJZSRmNw2
---

## Basic Structure
下方圖示標準的Android檔案結構(除了link-assets-manifest.json以外)

***
![Basic Structure](/assets/images/android-project-struct.png)

#### 目錄

* .gradle: 此目錄是從 gradle zip 建立/提取的，該 zip 是在執行時間下載的依賴項。
* .idea: 這個目錄是當我們在android studio中開啟專案時由Android Studio建立的。 在此目錄中，Android Studio 會新增 IDE 所需的索引和其他資料。
* app: 主要工作目錄。此目錄包含應用程式設計和流程的所有資源和程式碼。應用程式程式碼在這裡編寫，並添加了字體、圖像、應用程式圖標等資源。
* build: 這是一個專案級建置目錄，在建置時創建，用於儲存專案級建置緩存。
* gradle: 該目錄包含 gradle/dependencies 下載所需的 jar 文件，例如 gradle-wrapper.jar。 它將用於下載 gradle 依賴文件

***

#### 檔案

* build.gradle：此檔案包含有關建置建立的必需信息，例如 Android 目標 SDK 最低所需 SDK。 在哪裡可以找到外部依賴項，例如 Google、Maven 或 Maven Central。
* gradle.properties：該檔案包含一些在建置時使用的變量，我們可以說它是一個設定檔或環境文件
* gradlew：此檔案包含用於 Android 建置產生的腳本。 該檔案在 macOS 和 Linux 分散式系統中用於建構生成。 該檔案是用 shell 腳本編寫的。
* gradlew.bat：此檔案包含用於 Android 建置產生的腳本。 該文件是在批次腳本中編寫的。
* local.properties：該檔案包含本機環境所需的文件，例如 SDK 目錄路徑。
* settings.gradle：此檔案包含應在建置生成腳本執行之前執行的腳本。

#### app Directory
***
![app Directory](/assets/images/android-app-directory.png)

* build：此目錄包含建置指令的輸出，如 APK 或 aab 檔案及其所需的資料。
* src: 此目錄包含應用程式的資源和原始碼。
* libs: 假設需要引用外部所編寫的package可以放在這

#### app Files
***

* build.gradle：這是應用程式層級建置設定檔。 該文件儲存了建置所需的數據，例如建置類型、簽章配置、所需的依賴項等。
* debug.keystore：這是用於對偵錯版本進行簽署的金鑰庫檔案。
* proguard-rules.pro：該檔案包含 proguard 設定。 這有助於使應用程式變得輕量且更流暢。

#### app/src Directory
***
![app src Directory](/assets/images/android-app-src-directory.png)

* debug: 當您在偵錯模式下執行應用程式時，此目錄會自動產生。 該目錄包含調試應用程式使用的編譯後的 Java 檔案。
* main: 此目錄包含應用程式原始碼和應用程式所需的各種資源，如圖像、字體、顏色、應用程式圖示等。
* release: 此目錄是在發布模式下產生應用程式時自動產生的。 該目錄包含發布應用程式使用的已編譯的 Java 檔案。

#### app/src/main Directory
***

![app src main Directory](/assets/images/android-app-directory.png)

* assets：此目錄包含應用程式所需的資產，例如在發布的版本中建立/需要的字體和捆綁檔案。 該文件名稱為index.android.bundle。 該檔案是發布模式 APK/AAB 中 Metro 伺服器的替換。 字體應添加到字體目錄中。
* java: 該目錄包含app程式碼的主包。 在此目錄中，根據項目包名稱建立用點分隔的巢狀目錄。 在列表包名稱目錄中，存在應用程式的主要 Java 程式碼。
* res: 此目錄包含應用程式所需的資源，如圖片、mipmap、值、佈局等。

#### android/app/src/main Files
***

* AndroidManifest.xml：該檔案包含與作業系統通訊所需的應用程式的資料行為。 例如應用程式正在使用哪個權限？ 應用程式中有多少個活動（螢幕）？ 應該使用哪些資源作為應用程式圖示？ 哪個應用程式在主畫面/應用程式畫面中顯示名稱？ 以及哪個活動應該用作應用程式的入口點？ 透過 Intent-Filter 標籤定義的應用程式入口點。 內部活動標籤位於應用程式標籤下。

#### android/app/src/main/res(drawable/drawable-*dpi or mipmap/mipmap-*dpi) Directory
***

##### 主要放置 APP ICON

* mdpi: 此資料夾將包含具有較低裝置規格和較低顯示解析度的裝置的資源。 一般160dpi顯示器
* hdpi：此資料夾將包含具有較低設備規格和較低顯示解析度的設備的資源。 一般240dpi的顯示器
* xhdpi：此資料夾將包含具有中等設備規格和中等顯示解析度的設備的資源。 一般320dpi顯示器
* xxhdpi：此資料夾將包含具有較低規格和較高顯示解析度的裝置的資源。 一般480dpi顯示器
* xxxhdpi：此資料夾將包含具有更高設備規格和更高顯示解析度的設備的資源。 一般640dpi的顯示器
* anydpi：此資料夾將包含可在任何設定設備上使用的資源。 所以它一定是一個理想的解析度資源。 您也可以僅使用可繪製的命名資料夾而不是此資料夾。


### build.gradle File at project level
***

>該檔案包含應用程式通用配置。 在這個檔案中，所有設定都寫在buildscript區塊中。
> ext 區塊包含執行/建置應用程式所需的一些常見工具版本，例如 buildToolsVersion 和 ndkVersion。
>
> minSdkVersion 用於定義運行應用程式所需的最低 Android 版本。
>
> compileSdkVersion 用於告訴buildscript 應該在編譯時使用 SDK 版本，該版本應作為最新版本。
>
> targetSdkVersion 用於指定我們要建置的 Android SDK 應該順利運行的建置腳本。
>
> repositories 區塊包含 gradle 搜尋依賴項的位置。
>
> 依賴項區塊包含項目所需的依賴項及其版本。

### gradle.properties file
***

> gradle.properties檔案用於儲存一些變數值。 它的作用就像一個 env 檔。 所有變數的用法和描述都可以在宣告上方的註解中找到。 不過，您可以參考下面的參考資料來了解它。

```
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
```

上面的變數用於指定Gradle守護程式在建置過程中應使用多少內存

```
android.useAndroidX=true
```

上述變數強制 Android 使用 AndroidX 套件結構。

```
android.enableJetifier=true
```

上面的變數會自動將舊的套件結構轉換為AndroidX專案結構。

```
FLIPPER_VERSION=0.125.0
```

上面的變數指定應使用哪個 Flipper sdk。

```
ReactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

上面的變數指定建置中應支援哪種架構。

```
newArchEnabled=false
```

上面的變數指定 newArchitecture 是否啟用。 如果您想將渦輪模組/結構組件集成為渲染器，請啟用它。

```
hermesEnabled=true
```

上述變數指定 Hermes 引擎是否啟用。 用於js到本機程式碼的通訊。 如果為 false，則應用程式將使用 javascript 橋進行通信，這比 Herms 慢。

```
*_STORE_FILE=*****.keystore/.jks
*_KEY_ALIAS=*****
*_STORE_PASSWORD=*****
*_KEY_PASSWORD=*****
```

當您想要產生發布版本時，您將新增上述變數。 此變數用於對應用程式進行簽署。 通常，我們使用 .keystore 檔案來對應用程式進行簽署。

### AndroidManifest.xml file
***

>在manifest標籤中，有一個uses-permission標籤。 在此標籤 android:name 屬性中，我們可以指定應用程式使用的權限。 您可以新增與新增權限一樣多的標籤。
>
>在清單標記內，您可以找到應用程式標記，該標記接受應用程式所需的資源數據，例如應用程式類別名稱、應用程式名稱、應用程式圖示、應用程式圓形圖示和主題，並且應該是備份的一部分
>
>在應用程式標籤內，您可以看到一個活動標籤，它指的是應用程式的螢幕，它接受類別名稱、活動名稱、啟動模式、方向等。
>
>在名為 Activity 的 MainActivity 類別中，您將找到一個帶有操作的意圖過濾器標記和一個帶有其屬性的類別子標記。 它用於定義載入應用程式時的啟動活動。

### build.gradle file at app level
***

> 你會發現apply plugin語句用來加入Gradle所需的套件。
>
> 再來你會發現react區塊，用於自訂react本機應用程式預設配置
>
> 您將找到指定建置腳本配置的 Android 區塊。 應該使用哪個版本的建置工具（例如 SDK）？ 您將在 android 區塊中找到預設配置區塊，其中包含應用程式 ID、應用程式版本、應用程式版本程式碼以及最小和目標 sdk 版本。
>
> 在 Android 區塊內找到一個 splits 區塊。 用於指定如何分割不同架構的輸出檔。
>
> 在 Android 區塊內找到signingConfigs 區塊。 它用於定義各種簽章配置，例如金鑰庫檔案、密碼和金鑰別名。
>
> 在 Android 區塊內找到 buildTypes 區塊。 這用於定義各種構建類型，這些構建類型在 gradle 中添加命令以生成不同類型的構建，例如調試和發布。
>
> 您將找到 applicationVariants.all 區塊，它將取得所有架構的清單並迭代所有架構並產生所有架構的輸出。
> 在根級別，您將找到依賴項區塊。 用於定義應用程式所需的依賴項、第三方套件等。
> apply from 用於套用其他 Gradle 檔案中的 gradle 設定。
>
