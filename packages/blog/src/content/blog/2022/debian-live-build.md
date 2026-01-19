---
title: 'Debian Live Buildの使い方'
category: 'Software'
pubDate: '2022-02-02'
heroImage: '/src/assets/images/2022/debian-live-build/debian-live-build.jpg'
---

この記事に書かれている内容は不正確であり、記事の通りにやっても正常にビルドできない可能性があります。

この記事では、Live Buildの一部についてしか触れません。より詳しく知りたい方は[こちら](https://live-team.pages.debian.net/live-manual/html/live-manual/toc.ja.html)を見ることをお勧めします。

---

Debianには公式が提供しているDebian Live BuildというLiveCDを作成するためのツールがあります。

Beta2ではそれを使用してISOを作成しました。この記事はその備忘録です。

## インストール

live-bootとlive-configが必要なのかは知りません。

```bash
sudo apt install live-build live-boot live-config
```

## 制作

最初に作業用ディレクトリを作成して初期化します。

```bash
mkdir iso
cd iso
lb config
```

まずはミラーを設定します。ここはお好きなミラーに。

また今回は

- amd64

- bookworm

- 日本語

でISOをビルドしていきます。

```bash
lb config --mirror-bootstrap "http://ftp.jp.debian.org/debian/"
lb config --mirror-chroot "http://ftp.jp.debian.org/debian/"
lb config --mirror-binary "http://ftp.jp.debian.org/debian/"
lb config -a amd64
lb config --bootappend-live "boot=live components locales=ja_JP.UTF-8 keyboard-layouts=ja"
lb config --distribution bookworm
```

## パッケージ

次にパッケージのリストを作成します。

デスクトップ環境から入れていきますが、やはりパッケージを一つ一つリストに加えていくのは大変です。メタパッケージを使用すると楽ができます。

デスクトップにKDEを使用する場合は、`task-kde-desktop`というメタパッケージが利用できます。これを使用するとKDEのデスクトップ環境に必要なパッケージが取得できます。

```bash
echo '! Packages Priority standard' > config/package-lists/standard.list.chroot
echo task-kde-desktop task-japanese task-japanese-desktop >> config/package-lists/desktop.list.chroot
```

次にインストーラーを入れていきます。Calamaresを入れますが、なぜかDebianのbookwormにパッケージがなかったので、強引に入れていきます。[ここ](http://ftp.jaist.ac.jp/pub/Linux/kali/pool/main/c/calamares/calamares_3.2.44.3-1_amd64.deb)からamd64のパッケージをダウンロードします。[このライブラリ](https://ftp.riken.jp/Linux/ubuntu/pool/main/y/yaml-cpp/libyaml-cpp0.6_0.6.3-10_amd64.deb)も必要なのでダウンロードします。

**追記**

buster以降のすべてでパッケージが追加されたので、そのままリストに追加すれば使用可能です。

これらを`config/packages.chroot/`の中に入れていきます。

### オプション：リポジトリを追加

外部のリポジトリを追加する場合は、`config/archives/your-repository.list.chroot`と`config/archives/your-repository.list.binary`ファイルを作成します。

中身はこんな感じ（`etc/apt/sources.list.d`に入れるものと同じ）：

```plain
deb amd64 http://packages.microsoft.com/repos/code stable main
```

また、GPG鍵が必要な場合は同じディレクトリに`config/archives/your-repository.key.chroot`（binaryも同様）として追加します。

## 設定ファイル

もちろんこのままだとカスタマイズしたとは言えません。

そのため、`/etc/skel`や`/usr/share/...`などのディレクトリを手動で追加してやる必要があります。（スクリプトを作れば多少自動化できると思いますが、自分には技術が足らんよ...）

例えばLiveCDに`/boot/grub/themes`というディレクトリを追加しようと思ったら、`config/includes.chroot/boot/grub/themes`を作成する必要があります。

必要なコンフィグやテーマ等を`config/includes.chroot`に移し終えたら完了です。

## ビルド

ビルドは一回コマンドを実行するだけです。

```bash
sudo lb build
```

正常に終わると`live-image-amd64.hybrid.iso`が吐き出されます。

## 再ビルド

再ビルドするときは、以下のようにします。

```bash
sudo lb clean --binary
lb config
sudo lb build
```

binaryオプションを付けると、パッケージのキャッシュを削除しないので、再ビルドの時間が多少短くて済みます。（`config/includes.chroot`を変更した場合はキャッシュを削除する必要があるので、binaryオプションはつけません。）

## 問題

### Debian Installerが正常に作成できない

Live BuildにはDebianが用意しているDebian Installerというインストーラーを入れることができるのですが、どうにもudebのダウンロードで問題が発生します。何時間か悩みましたが、結局原因が分からなかったのでCalamaresを使用しました。

### CalamaresをLive CDで使えるようにする

Debianが公式に公開しているCalamaresの設定があるので、それを参考に作成しました。

[https://salsa.debian.org/live-team/calamares-settings-debian](https://salsa.debian.org/live-team/calamares-settings-debian)

### バージョンが違う

なぜかdistributionの設定をしただけだとうまく行かなかった気がします。`config/common`か`config/bootstrap`を見るとbookwormを指定したはずなのにbusterになっている箇所があったので、直したらうまくできました。

### Grubのテーマを変えたい

`/etc/default/grub`を編集し、`/boot/grub/themes`にテーマを入れ、desktop-baseのパッケージを使わないようにしたらできました。

## 最後に

Live BuildでISOをビルドする方法などを詳細に書いてある記事が少なく、調べるのに苦労しました。

## 参考

https://live-team.pages.debian.net/live-manual/html/live-manual/toc.ja.html

http://yakushi.shinshu-u.ac.jp/debian-live/osc2013fukuoka-debian-live.pdf

https://qiita.com/homelith/items/f30a1fbac89dc977c1ff
