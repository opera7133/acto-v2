---
title: 'LinkCore風のサイトを作った'
category: 'Software'
pubDate: '2020-07-12'
updatedDate: '2020-11-06'
heroImage: '/images/2020/linkcore-gen/link.png'
---

LinkCoreって知ってますか？あのTuneCore（音楽配信代行）の短縮URLサービスです。  
今回はそれっぽいものを作ってみたので少し紹介します。

## 作り方

https://dlbase.cf

上のリンクにアクセスして、作成→URLを入力するだけです。後は勝手に生成してくれます。

## 仕組み

linkco.reから適当に引っ張ってきたソースを、一部改変して、PHPで変数に代入させたりif分岐させたりしています。あとはMaterialize CSSでいい感じのトップページとフォームを作ってできました。作業時間は４時間ぐらいです。ソースはGithubに上げてます。

## 対応しているサービス

- MEGA (mega.nz)
- Google Drive (drive.google.com)
- OneDrive (onedrive.live.com)
- Mediafire (mediafire.net)
- Dropbox (dropbox.com)
- Box (box.com)
- icedrive (icedrive.net)
- Cloud mail.ru (cloud.mail.ru)
- pCloud (pcloud.com)
- Sync (sync.com)
- Yandex Disk (disk.yandex.com)

## 更新

結構いろんなサービスを追加しました。あと、ファイルの拡張子ごとにアイコンが変わるようになりました。ついでにチェックボックスの選択ボタンを追加しました。ちなみにGithub Actionsの方見てもらえればわかると思いますがサーバーはlolipopです。最近あたらしいサーバー買いました。（お前そういうのしかやんねえな）
