---
title: 'ChromeXtを導入して、AdShield広告をブロックする'
category: 'Web'
pubDate: '2025-01-14'
heroImage: '/src/assets/images/placeholder.png'
draft: true
---

最近「小説家になろう」を読んでいたときにDNS広告ブロッカーを使っていても消えない広告があり、ソースを調べてみました。

どうやら`html-load.com`と`content-loader.com`というドメインが悪さをしているようですが、これらをブロックするとエラーが発生します。

このエラーは`report.error-report.com`というそれらしいサイトで表示されますが、`error-report.com`にアクセスすると`html-load.com`に飛ばされます。

このドメインで広告がホストされているのは間違いありませんが、特にサイトコンテンツのロードに関係しないのに関係しているように表示するのはかなり悪どいと感じます。

## tinyShieldとは

https://github.com/List-KR/tinyShield

この`html-load.com`などのドメインで広告を出しているAdShieldの広告をブロックするためのスクリプトが**tinyShield**です。

tinyShieldはユーザースクリプトで、デスクトップ向けブラウザやFirefox Androidなどの拡張機能が追加できるブラウザであれば、TampermonkeyやViolentmonkeyを追加することで利用できます。

## ChromeXt

https://github.com/JingMatrix/ChromeXt

しかし、Android版のChromeやChromeベースのブラウザでは拡張機能を使用できません。（Microsoft Edgeは例外的に利用できます）

ChromeXtを使用すると、拡張機能をいれることなくユーザースクリプトを利用できます。

### インストール

非root環境であることを前提にします。

1. ブラウザのapkをダウンロード（Vivaldiの場合は[その他のダウンロードストア](https://vivaldi.com/ja/android/)からARM 64bit）
2. [LSPatch](https://github.com/JingMatrix/LSPatch/actions)から最新で成功しているものを選択し、Artifactsの`lspatch-release-***`となっているものをダウンロード
3. [ChromeXt](https://github.com/JingMatrix/ChromeXt/actions/workflows/android.yml)から最新で成功しているものを選択し、ArtifactsのChromeXt.apkをダウンロード
4. それぞれ解凍し、lspatchのフォルダに`ChromeXt-signed.apk`を入れる
5. `java -jar jar-v0.7-430-release.jar Vivaldi.7.0.3505.165_arm64-v8a.apk -d -v -m ChromeXt-signed.apk --force --injectdex` (ファイル名はビルドによって違います)
6. パッチされたAPK`***-lspatched.apk`をAndroid端末に転送しインストール

これで完了です。[ChromeXt](https://jingmatrix.github.io/ChromeXt/)にアクセスした際に"ChromeXt is working"と出ていれば成功しています。

### ユーザースクリプトをいれる

https://github.com/List-KR/tinyShield#quick-start

tinyShieldのユーザースクリプトのリンク（cdn.jsdelivr.net/...）にアクセスしてみましょう。

インストールダイアログからインストールできます。
