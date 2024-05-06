---
title: 'Skynetを使って簡単にファイルをアップロードしよう'
category: 'Web'
pubDate: '2021-07-24'
heroImage: '/images/2021/skynet/skynet.png'
---

## Skynetとは？

https://coinpost.jp/?p=133731

Siaを使ってデータをホストしたり、ウェブアプリケーションを運営したりすることができるサービスです。  
現在（21/07）無料で100GBまで使用することができ、月80ドル払うと最大20TBまで使用することができるそうです。  
運営はSiaという分散型ストレージサービスを運営しているNebulous Labs。  
Siaについてはこちらの記事が参考になるかもしれません。

https://gigazine.net/news/20200310-sia-cloud-storage-2-dollar/

## 使い方

https://siasky.net

試しにこの記事のアイキャッチ画像をアップロードしてみます。  
今回は公式のポータルを使用。

![siasky.net](/images/2021/skynet/image-7.png)

アップロードしてしばらく待つと…

![アップロード中](/images/2021/skynet/image-8.png)
![アップロード完了](/images/2021/skynet/image-9.png)

こんな感じでSkyリンクとともにアップロードされます。  
アカウント登録なしの場合は、90日でファイルが削除されるそうです。

## Python

Skynetは開発者向けにSDKを提供しており、以下の言語をサポートしています。

- Shell（curl）
- JavaScript
- Node.js
- Python
- Go

今回はPythonで試してみます。  
公式のドキュメントでサンプルのコードが提示されているので、そちらを使用していきます。

```python
import siaskynet as skynet

# クライアントの作成
client = skynet.SkynetClient()

# アップロード
skylink = client.upload_file("./skynet.png")
print("Upload successful, skylink: " + skylink)

# ダウンロード
client.download_file("./skydl.png", skylink)
print("Download successful")
```

アップロードされると、skylinkが表示されます。

![アップロード後の表示](/images/2021/skynet/image-10.png)

ダウンロードするときはこのようになります。

![ダウンロード時](/images/2021/skynet/image-11.png)

## 用途

ちょっとした画像をアップロードしたり、普通のファイルアップローダーとして使ったり、ファイル共有用として使うのに便利だと思います。
