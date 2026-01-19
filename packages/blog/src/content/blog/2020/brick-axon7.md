---
title: '文鎮になったAXON7を復活させる'
category: 'Smartphone'
pubDate: '2020-05-20'
updatedDate: '2020-11-06'
heroImage: '/src/assets/images/2020/brick-axon7/ax7.png'
---

この前、FireHD 8 (2017)をRoot化し、Lineage OSを入れました。  
ついでに、文鎮化してほったらかしにしていたZTE AXON7をどうにかできないかなと思って復活させてみました。

## 経緯

Android 9にしようと思って、適当にYoutubeにあった動画を真似してROMを焼きました。  
ただ、そのROMが中華のやつだったんですよね…  
そこからどうにかできないか試行錯誤やって、一回は治りました。  
しかし、そのあと欲張ってRoot化しようとしてしまったため、そこでぶっ壊れました。

## 状態

充電中は赤ランプが点滅し、EDLモードを起動しようと音量上下+電源ボタンを長押ししたがなにもならない。  
電源を長押しすると、バイブレーションのあと赤ランプがついたままになる。

## 復旧

※本記事はWindowsを使用することを想定して書かれています。  
※本記事によって発生した事故・損害について、投稿者は一切責任を持ちません。  
まず、以下のものをダウンロードします。

A2017G_B12_NOUGAT_FULL_EDL(7.1.1)  
[AndroidFileHost](https://androidfilehost.com/?fid=1322778262903993129) / [Mega](https://mega.nz/file/kfIUkSoZ#xwheAK-oTPYfsZhVq0y-auKX0rP7a0hH49GKS0i0p6w)

Axon 7 EDL Tool  
[XDA Forums](https://forum.xda-developers.com/axon-7/development/axon-7-edl-tool-flash-backup-restore-t3750759)

Qualcomm / USB Driver  
[Qualcomm Driver](http://www.mediafire.com/file/738z5be3x5fpgcb/Qualcomm_USB_Driver_V1.0.zip)  
[USB Driver](https://dl-ssl.google.com/android/repository/latest_usb_driver_windows.zip)

### EDL Toolを使ってFlash

まず、ダウンロードしたEDL Toolを、Cドライブ直下に”edltool”といった名前のフォルダを作成しそこに解凍します。  
次に、edltool内のフォルダ”flash”から”full”に移動し、そこにA2017G_B12_NOUGHT_FULL_EDLを解凍します。  

ここで、Axon7をPCにつなげて電源をオンにしておきます。  
そうしたら、Axon7_EDL_Tool.batを管理者権限で起動します。

上の画面のようになったら、Yと打ちます。  
すると、自動的にEDLモードに入ります。  
今回はFlashするので、1と打ちます。  
そして、もう一度1と打ちます。  
警告画面が出るので、Yと打ちます。  
あとは気長に待ちましょう。  
何かダイアログが出たら、Yを打ちましょう。  
Axon7が再起動します。

## LineageOSを入れる

LineageOSを入れる  
また欲張ってしまいました。  
ただどうにかなったので、これも書いときます。

以下のものを入れておきましょう。

Axon7Toolkit  
https://github.com/bennykor/Axon7Toolkit/releases

TWRP(ailsa_ii)  
https://eu.dl.twrp.me/ailsa_ii/

ADB / Fastboot  
https://androidfilehost.com/?fid=6006931924117923181

Lineage OS 15.1 (UNOFFICIAL BUILD)  
https://androidfilehost.com/?w=files&flid=292911

A2017G_OreoModem / A2017x_LineageOS15.1_UniversalBootstack_v2  
https://androidfilehost.com/?w=files&flid=270519

OpenGapps（任意）  
https://opengapps.org/

### 1.BootloaderをUnlock

Axon7Toolkitはウイルス対策ソフトにブロックされやすいので、一時的に無効にしておいてください。  
Axon7をPCにつないでおきます。（OSが入っている場合は、OEMロックを解除・USBデバッグの有効化をしておきましょう）  
まずはAxon7Toolkitを起動して、7と打ちます。  
しばらくするとmiFlashが起動するので、Selectから

“C:\Axon7Development\Axon7Toolkit\miflash\unlock\FASTBOOT_UNLOCK_EDL_N”

を選択し、Flashをクリックします。  
Flashはすぐ終わるので、miFlashは閉じ、Axon7を再起動します。  
起動途中にダイアログのようなものが出るので、音量ボタンで”Fastboot”に合わせ電源ボタンで選択します。  
先ほどのAxon7Toolkitのダイアログで何かキーを押し、とりあえずOKを押していきます。  
ダイアログが閉じたら完了です。

### 2.TWRPのインストール

TWRPの最新版をダウンロードしておき、recovery.imgにリネームします。  
そして、ADB Fastboot minimal Portableを適当な場所で解凍し、そこでコマンドプロンプトを立ち上げます。  
先ほどのrecovery.imgをこのフォルダにコピーし、以下のコマンドを入力します。

```bash
fastboot flash recovery recovery.img
```

これでインストールは完了です。  
あと、C:\Axon7Development\Axon7Toolkit\twrpからno-verity-opt-encryptをSDカードにコピーし、インストールしておきましょう。

### 3.OSインストールの前準備

今回はLineage OS 15.1をインストールします。  
残念ながらLineage OS 16をインストールする方法が全く分からなかったです。

まず、SDカードにOreoModem・UniversalBootstrak・Lineage OS (・OpenGapps)を入れます。  
そして、TWRPを起動。  
インストールから、UniversalBootstrak→OreoModemの順番でインストールします。  
終わったら、再起動してもう一度TWRPを起動します。  
おそらく、バージョンが下がっていると思うので、もう一度2.TWRPのインストールを行ってください。

### 4.OSのインストール

作業を行う前に、消去から高度な消去→System/data/cache/Dalvik Cacheを選択し、消去します。  
先ほどダウンロードしたLineage OS 15.1の非公式ビルドとOpenGapps（任意）を選択し、インストール。  
あとは、再起動するだけです。

## 結果

どうにか安定して動くようになりました。  
ここまでにだいたい5時間ぐらい費やしました。  
もし、「情報をアップデートしています」画面で止まってしまった場合、再起動すれば治ります。

ちなみに、カメラが20MPに対応していません。  
代替として、OpenCameraを入れておくことをお勧めします。  
あと、DolbyAtmosを入れたい場合は自力で探してください。

なお、Root化はしていないため、載せません。  
あとAndroidFileHostのクソ遅いのをどうにかしてほしい。
