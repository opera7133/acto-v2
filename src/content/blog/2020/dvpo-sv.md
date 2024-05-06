---
title: '【OP25B】DovecotとPostfixを使ったIMAP/POP3/SMTPサーバー【CentOS】'
category: 'Server'
pubDate: '2020-03-03'
updatedDate: '2020-12-29'
heroImage: '/images/2020/dvpo-sv/sm.png'
---

### 構成

Server : Vultr CloudCompute 1CPU 1GB  
OS : CentOS8  
PHP : 7.3.13  
Server : OpenLiteSpeed  
Domain : freenom

### 必要なもの

- VPSサーバー
- SendGridアカウント
- ドメイン

## 環境整備

### A/MXレコードの設定

まずは、ドメインを設定していきます。  
Vultrを使用している場合は、ネームサーバーを

- ns1.vultr.com
- ns2.vultr.com

に設定します。  
次はVultrDNSで、A/MXレコードを追加します。

mail.example.comで運用する場合は、上のように入力してください。  
IPは各サーバーに割り当てられているものを入力してください。

### MXレコードの確認

設定が完了したら、反映されているかどうかを確認します。  
bind-utilsをインストールし、hostコマンドを使えるようにしましょう。

```bash
sudo yum -y install bind-utils
```

example.comのMXレコードを確認する場合は、以下のコマンドを実行します。

```bash
$ host -t mx example.com
example.com mail is handled by 10 mail.example.com
```

上記のように表示されていれば、設定が完了しています。

### 必要なもののインストール

今回はDovecot、Postfixのほかに、RoundCubeを使用します。  
そのため、ほかに色々と設定しなければいけないため、それらを準備します。  
まずはDovecotとPostfixをインストールします。

```bash
sudo yum -y install dovecot postfix
```

次に、openlitespeedを入れるために、リポジトリを登録しインストールします（lsphpも）。

```bash
sudo rpm -ivh http://rpms.litespeedtech.com/centos/litespeed-repo-1.2-1.el8.noarch.rpm
sudo yum -y install openlitespeed lsphp73 lsphp73-devel lsphp73-mysqld lsphp73-gd lsphp73-json lsphp73-mbstring lsphp73-intl lsphp73-imagick lsphp73-zip lsphp73-pear
```

これで完了です。

## dovecotの設定

ここから設定に入りますが、非常に面倒です。  
のんびりやりましょう。

### dovecot.conf

```bash
sudo vim /etc/dovecot/dovecot.conf
```

```plain
#protocols = imap pop3 lmtp
↓
protocols = imap pop3
```

### 10-mail.conf

```bash
sudo vim /etc/dovecot/conf.d/10-mail.conf
```

```plain
# mail_location = maildir:~/Maildir
↓
mail_location = maildir:~/Maildir
```

### 10-master.conf

```bash
sudo vim /etc/dovecot/conf.d/10-master.conf
```

```plain
# Postfix smtp-auth
# unix_listener /var/spool/postfix/private/auth {
# mode = 0666
# }
↓
# Postfix smtp-auth
unix_listener /var/spool/postfix/private/auth {
mode = 0666
user = postfix
group = postfix
}
```

### 設定の確認

```bash
sudo doveconf -n
sudo systemctl restart dovecot
```

ここまでできたら、Dovecotの設定は終了です。

## postfixの設定

こちらもまた面倒な作業です。  
main.cfにいちいち記述するのも面倒なので、以下のコードをコピペしてください。  
（example.comは各自で置き換えてください）

https://pastebin.com/eF68wNuh

コードを保存したら、sasl_passwdというファイルを作成します。

```bash
sudo vim /etc/postfix/sasl_passwd
```

```plain
[smtp.sendgrid.net]:587 yourSendGridUsername:yourSendGridPassword
```

それぞれにアカウント情報を入力して保存します。  
sasl_passwdをハッシュ化します。

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

次にmaster.cfを設定します。

```bash
sudo vim /etc/postfix/master.cf
```

https://pastebin.com/dFNeTpyE

最後に再起動します。

```bash
sudo systemctl restart postfix
```

## ファイアウォールの設定

```bash
sudo firewall-cmd --zone=public --add-service={smtp,smtp-submission,pop3,imap,http,https,smtps,imaps,pop3s} --permanent 
sudo firewall-cmd --add-port=7080/tcp --permanent
sudo firewall-cmd --reload
```

## OpenLiteSpeedの設定

```bash
sudo systemctl restart lsws
```

`http://IPアドレス:7080`を開きます。  
バーチャルホスト→追加から以下のように設定します。

ルートディレクトリは変更してもかまいません。  
作成したバーチャルホストを選択し、一般タブから以下の項目を設定します。

DocumentRoot : $VH_ROOT/html/  
サーバーインデックスファイルを使用する : いいえ  
インデクスファイル : index.html, index.php

そしたら、リスナーを設定する前に、CertbotでSSL証明書を取得します。

```bash
sudo yum -y install certbot sudo certbot certonly --manual --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory -m [your email] -d example.com \ -d *.example.com
```

ドメインとメールアドレスは各自でセットしてください。  
DNS設定についてはこの記事では省きます。（前記事にて紹介しているため）

最後に、リスナーを作成します。

ポートは443で、セキュアにします。  
あとは、設定したいドメイン名を登録します。

SSLタブから、  
/etc/letsencrypt/live/example.com/fullchain.pem  
/etc/letsencrypt/live/example.com/privkey.pem  
をセットします。

あとは、リスナーにバーチャルホストを追加しましょう。

## RoundCube +aのインストール

```bash
sudo curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash
sudo yum -y install MariaDB-server
sudo mysql_secure_installation
cd /var/www/rc/html
sudo wget https://github.com/roundcube/roundcubemail/releases/download/1.4.3/roundcubemail-1.4.3-complete.tar.gz
sudo tar -zxvf roundcubemail-1.4.3-complete.tar.gz cd roundcubemail-1.4.3-complete
sudo mv * ..
cd ..
sudo rm -rf roundcubemail-1.4.3-complete
```

`https://example.com/installer/index.php`にアクセスして、インストールしましょう。  
この記事の解説は以上です。
