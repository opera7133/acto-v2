---
title: 'コマンドラインでファイル転送できる便利な奴'
category: 'Software'
pubDate: '2022-02-12'
updatedDate: '2026-01-19'
heroImage: '/src/assets/images/2022/terminal-file-transfer/command-file-transfer.jpg'
---

コマンドラインからファイルを転送したいと思ったことありませんか？

ありますよね？

そう、あるんですよ。

ということで、この記事ではコマンドラインでファイルを転送できるサービスを紹介していきます。

ちなみに全て無料です。

## ~~transfer.sh~~(閉鎖)

最長2週間、サイズ無制限のファイル共有サービスです。

MITライセンスでソースコードが公開されており、自前のインスタンスを立てることができます。

使い方：

```shell
curl --upload-file file.txt https://transfer.sh/file.txt
```

## Station307

https://www.station307.com/

こちらはファイルをアップロードするわけではなく、送信者のローカルマシンから直接ダウンロードできるようにするものです。

サイズは無制限、ブラウザのタブを閉じる（またはコマンドを終了する）までファイルを共有できます。

使い方：

```shell
curl -T file.txt -Lv station307.com 2>&1 | grep located-at
```

## ~~bashupload~~(閉鎖)

最大50GB、最長3日までファイルを保存できるアップローダーです。ダウンロードは一回のみ。

使い方：

```shell
curl bashupload.com -T file.txt
```

## temp.sh

https://temp.sh/

最大4GB、最長3日のアップローダー。

使い方：

``` shell
curl -T file.txt temp.sh
```

## tmp.ninja

https://tmp.ninja/

Uguuを使用している一時ファイル共有サービス。

最大10GB、最長2日まで保存可能。

使い方：

```shell
curl -i -F files[]=@file.txt https://tmp.ninja/upload.php
```

## termbin

https://termbin.com/

これはアップローダーではありませんが、似ているので一応紹介。

pastebinのようなテキスト共有をコマンドラインから行えるサービスです。

使い方：

```shell
echo "just testing!" | nc termbin.com 9999
```
