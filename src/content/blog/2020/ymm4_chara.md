---
title: 'きつねゆっくり素材をYMM4用に変換するやつ'
category: 'Software'
pubDate: '2020-03-12'
updatedDate: '2021-10-26'
heroImage: '../../../assets/images/2020/ymm4_chara/ymm4_chara.png'
---

YMM4が単体出力できることを知って、最近はそっちを使うようにしています。  
しかし、YMM4にはYMM3ほど簡単にキャラ素材を入れられないことが分かりました。  
なのでPythonで適当にコード書いて自動で変換してくれるやつを作りました。（目と口専用です。）

### ダウンロード

動作の保証はしません。

https://dl.wmsci.com/dl/software/YMM4Chara.zip

### ソースコード

[YMM4K – pastebin.com](https://pastebin.com/ATiGiDFS)  
[YMM4F – pastebin.com](https://pastebin.com/e6CbaAKR)

### 仕組み

動作フォルダを判別し、口の場合は00a→00.1のように、目の場合は00a→00.5のように処理させました。  
このコードをもっとよくしてくれたらうれしいです。（需要があるかどうかはわかりませんが…）

### 参考

https://qiita.com/yaju/items/9b81ef370bdc02b49fdd
