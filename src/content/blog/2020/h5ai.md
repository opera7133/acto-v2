---
title: 'h5aiでインデックスを見やすくする'
category: 'Server'
pubDate: '2020-08-07'
updatedDate: '2020-12-29'
heroImage: '../../../assets/images/2020/h5ai/h5ai.png'
---

h5aiというサーバーのインデックスページをきれいにできるものがあります。  
これはapacheとnginxに対応しているので、これを使ってリポジトリとかファイルとかを置いてある鯖を見やすくしましょう。

## 導入

```plain
DOC_ROOT
 ├─ _h5ai
 ├─ your files
 └─ and folders
```

まずはサイトのルートディレクトリにh5aiを解凍します。  
念のためサーバーソフトを再起動して、以下のURLにアクセスします。

`http://（あなたのドメイン）/_h5ai/public/index.php`

特に設定をいじっていない場合はパスワードはないので、そのままLoginを押しましょう。とりあえず全部緑文字になっていれば大丈夫です。

私の環境ではCPUが32bitだったためPHPも32bitです。  
なお、PHPが32bitだと2GB以上のファイルのファイルサイズが表示できません。

### Apacheの場合

もしhtaccessを使えるようにしてあれば、以下の記述を追加してください。

```plain
DirectoryIndex  index.html  index.php  /_h5ai/public/index.php
```

### Nginxの場合

nginx.confまたは各サイトごとのコンフィグファイルのlocation内に以下の記述を追加してください。

```plain
index  index.html  index.php  /_h5ai/public/index.php;
```

## メディア

動画ファイルの再生にはffmpeg、PDFにはgmなどのソフトを入れる必要があります。  
また、_h5aiフォルダのpublic/cacheおよびprivate/cacheを777に設定しておくとエラーが出ません。
