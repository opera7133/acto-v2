---
title: 'Nextcloudとラズパイで公開クラウドストレージを作る方法【自宅サーバー】'
category: 'Server'
pubDate: '2019-11-28'
updatedDate: '2021-05-24'
heroImage: '/src/assets/images/2019/next-rasp-server/rsp.png'
---

### 構成

Model: Raspberry Pi 3 B+  
OS：Raspbian buster  
PHP:7.4  
Server: Apache  
Nextcloud: 17.0.1  
Router: F660A  
Domain: freenom  
家に余っている外付けHDDがなかったので、Prime Note Galleria QF560に付属のTOSHIBA製500GBを使用しました。

### 必要なもの

Raspberry Pi 3 Model B+  
micro SDカード 16GB  
電源ケーブル（今回は別で買いました）  
HDD（500GB以上推奨）  
USBキーボード・マウス  
外付けHDD用ケーブル

### 前提

- vimインストール済み
- IPアドレス固定済み

## 作り方

### 基本

まずはパッケージ更新をします。

```bash
sudo apt-get update
sudo apt-get upgrade
```

### サーバーのインストール

Apacheとphp7.4をインストールします。

```bash
sudo apt-get install apache2
sudo apt-get install php7.4
```

### NextCloudのインストール

ウェブサーバーの公開ディレクトリに移動

```bash
cd /var/www/html
```

### NextCloudのファイルをダウンロード

記事公開時点での最新版は17.0.2でした。

```bash
curl https://download.nextcloud.com/server/releases/nextcloud-17.0.1.tar.bz2 | sudo tar -jxv
```

もしドメイン直下からアクセスさせたければ、nextcloudフォルダ内のファイルをすべて~/htmlの中に入れましょう。

### データベースのインストール

今回はMariaDBを使います。

```bash
sudo apt-get install mariadb-client mariadb-server
```

インストール後、MariaDBにログインします。

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE (db-name);
CREATE USER '(db-username)'@'localhost' IDENTIFIED BY '(db-userpass)';
GRANT ALL PRIVILEGES ON (db-name).* to '(db-username)'@'localhost';
FLUSH PRIVILEGES;
quit
```

(db-name):データベース名  
(db-username):データベースユーザー名  
(db-userpass):ユーザーのパスワード  
をそれぞれあてはめてください。

### HDD

さて、面倒な作業がやってきました。  
外付けHDDを購入した人は、Raspberry piにつなげましょう。  
家に余っていたHDDを使う場合は、USB-SATAケーブルを買い、つなげましょう。

```bash
df
```

まずは、dfコマンドでHDDがどこにつながっているか調べましょう。  
マウント位置もしくは使用可の大きさで接続先が分かると思います。  
たいていは/dev/sda1につながっていると思います。

---

今回はGPartedを使用します。

```bash
sudo apt-get install gparted
```

でインストールします。  
（※ここから先、画像がありません。）  
そしたら、右上の接続先から、先ほど確認したものを選びます。  
そして、すべてのパーティションを削除します。  
次に、未割りあてとなっているところを右クリックし、”新規”ボタンをクリックします。  
ファイルシステムをext4にし、”追加”をクリックします。  
最後に、上のチェックマークをクリックし、しばらく待てば完了です。

---

マウントフォルダを指定し、マウントします。  
今回はmedia/nxhd1にします。

```bash
sudo mkdir /media/nxhd1
sudo mount /dev/sda1 /media/hdd1t
```

これでほぼ完了です。

しかし、ほぼ完了といってもまだ終わりではありません。  
fstabに記入する作業が残っています。  
まずはUUIDを調べましょう。

```bash
sudo blkid -o list
```

UUIDをコピーして、fstabを開きます。

```bash
sudo vim /etc/fstab
```

以下のように書き込みましょう。

```fs
UUID=XXXXXXXXXXXXX /media/hdd1t ext4 defaults,nofail 0 0
```

そして、再起動しましょう。  
これが失敗すると面倒で、Raspberry piからSDカードを抜き、WindowsPCなどで、boot内のcmdline.txtに、

```plain
init=/bin/sh
```

を最後に追記してSDカードを戻し、起動。  
fstabをもとの状態に戻して、先ほどとは逆の作業をして…  
ということをしなければなりません。  
私はこの作業の影響でファイルマネージャーが立ち上がらなくなりました。

### NextCloudを設定

Apacheを再起動し、`http://localhost/`にアクセスします。

```bash
sudo service apache2 restart
```

アクセスすると、いろいろPHP関連が足りないといわれるので、追加します。

```bash
sudo apt-get install php7.4-mysql php7.4-pgsql php7.4-zip php7.4-dev php7.4-mbstring php7.4-gd php7.4-curl
```

ユーザー名やパスワードは自由に設定してかまいません。  
データフォルダーは先ほどマウントした位置に。  
データベース関連は作成時に入力した名前・ユーザー名・パスワードを入力。  
ホスト名はlocalhostまたはIPアドレスを入力。  
これで設定は完了です。

### ポート開放

今回は外部に公開するため、ルーターのポート開放を行います。  
私の家ではNuro光を使用しているため、F660Aの画面を参考に説明します。

![ポートフォワーディングメニュー](../../../assets/images/2019/next-rasp-server/rasp1.png)

アプリケーションからポートフォワーディングを選択

![ポートフォワーディングサンプル](../../../assets/images/2019/next-rasp-server/rasp2.png)

上の画像のように入力  
（名前は適当に。内部ホストのIPアドレスはRaspberry piのIPアドレスを入力）  
SSLを設定するときは80→443 81→444のようにしましょう。

### ファイアウォール設定

外部に公開するときは、もちろんファイアウォールを設定しましょう。

```bash
sudo apt-get install ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

できればSSHのポートもセキュリティ上変更しておいたほうが良いです。

### ドメインの接続

難関、再び。  
まずは、myDNSに登録します。

そして、メールアドレス認証を行った後、発行されたID・パスワードでログインします。

A.無料のサブドメインもしくは取得済みのドメインを入力  
B.＠もしくは希望のサブドメインを入力（Aレコード）  
入力し終わったら、CHECK→OKをクリックします。  
そしたら、homeなどにnotice.shというファイルを作成します。  
中に以下を記述します

```bash
#!/bin/bash
wget -O - 'http://(username):(password)@www.mydns.jp/login.html'
```

(username)や(password)はそれぞれmydnsのものです。  
保存したら、

```bash
chmod 755 notice.sh
```

を入力し、

```bash
crontab -e

30 * * * * /home/(username)/notice.sh
```

と書きましょう。(username)はRaspberry piのユーザー名です。  
最後に、nextcloudのconfigファイルに、登録したドメインを追加しておきましょう。

### Let’s encryptの導入

```bash
sudo apt-get install certbot
sudo apt-get install python-certbot-apache
```

証明書を取得します。
ドメインが正しく接続されているかを確認して下さい。

```bash
sudo certbot --apache
```

つまづいたこと

1. HDDがうまくマウントされない → nofailsに設定したところ直った。
2. SSLが設定できない → 調査中
3. ドメインが接続されない → Cloudflare経由でのアクセスは安定しないようなので、MyDNSから接続させる。
4. アプリストアが開けない → おそらくIP関係が原因
5. メールサーバーが分からない → Sendgridを経由させることによって解決
6. なぜか外部からアクセスできない → そもそもRaspberry PiのルーターIPの設定が間違っていた  
→192.168.1.1に直すとアクセスできるようになった

## 追記

今回は、freenomのドメインを使用しましたが、ちょうどメンテナンス時期と重なっており、なかなか時間がかかりました。

## 参考にしたサイト

https://raspida.com/nextcloud-rpi3b

https://qiita.com/meznat/items/3d6d06220ba4efd3666a

https://qiita.com/pira/items/10efe9e93cbf13e1617f
