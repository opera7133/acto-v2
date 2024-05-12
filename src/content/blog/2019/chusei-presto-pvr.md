---
title: 'CHUSEI PVR(Presto! PVR)のプロダクトキーがない時の対処'
category: 'Software'
pubDate: '2019-08-08'
updatedDate: '2020-12-29'
heroImage: '/src/assets/images/2019/chusei-presto-pvr/pvr.png'
---

久しぶりに掃除をしていたら、ワンセグチューナーを見つけました。  
型番はDS-DT308SV  
株式会社ゾックス（現在ページなし）の販売していた製品のようです。  
ただし、見つけたはいいもののCD-ROMがないため、シリアルキーがわかりません。  
このゾックスという会社はもう存在しないようです。  
どうすればいいのかGoogleで検索してみると、その方法が書いてありました。  
（現在その記事はみつからないため、 サイトごと削除されたのではないかと思われます。）

## 方法

まず、ドライバーをダウンロードします。

WebArchive版  
[https://web.archive.org/web/20160324192508/http://zox-net.com/download/chusei_pvr/exe/chusei_pvr8_32_01.exe](https://web.archive.org/web/20160324192508/http://zox-net.com/download/chusei_pvr/exe/chusei_pvr8_32_01.exe)

最初に、ダウンロードしたファイルを実行し、解凍します。

![ダウンロード](/src/assets/images/2019/chusei-presto-pvr/c00.png)

![解凍](/src/assets/images/2019/chusei-presto-pvr/c01.png)

![解凍したファイル](/src/assets/images/2019/chusei-presto-pvr/c02.png)

次に、解凍したフォルダの中にある`Setup.exe`を実行する前に、PVRフォルダの中にある`LUTRAY.ini`を編集します。

![LUTRAY.ini](/src/assets/images/2019/chusei-presto-pvr/c03.png)

ファイルの中にOEM-Product-IDというものがあるので、例えば`T0000-00000-00000`とか入力します。  
保存すれば、正常にインストールができます。

![変更後](/src/assets/images/2019/chusei-presto-pvr/c04.png)

ある記事ではRegeditで認証させるという方法もあったようですが、私はあまりお勧めしません。
