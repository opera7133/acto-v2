---
title: "NodeCGで作るリアルタイム配信レイアウト"
pubDate: "2022-08-20"
category: "Software"
heroImage: '/src/assets/images/2022/nodecg-realtime/nodecg-realtime.png'
---

先日配信で情報をリアルタイム更新できるものを探していたところ、RTAinJapanがNodeCGというものを使っていることを知りました。

このNodeCGでVCborn夏祭りに使用するためのレイアウトを作ったのでその備忘録を残しておきます。

## NodeCGとは

ライブ配信のレイアウト作成のためのNode.jsフレームワークです。

レイアウトの情報を操作するdashboardと実際に表示するgraphics、バックエンドのextensionの三つで構成されていて、これらをまとめたbundleを作成することでレイアウトを作成します。

VCborn夏祭りで使用したスライドはこちらからどうぞ。

https://speakerdeck.com/wamosc/vcbornxia-ji-ri-with-nodecg

## 欲しいもの

- Youtube + Twitter + Discordのチャット

- 喋っている人と現在のイベントを表示

- 待機画面（次のイベントを表示）

- 下部広告

## NodeCGの導入

NodeCGの導入方法については[こちらの記事](https://zenn.dev/cma2819/articles/start-nodecg-01)が参考になります。

また、NodeCGのbundleの作成は[こちらの記事](https://blog.livewing.net/nodecg-react)をそのままやっています。

## 工夫

### MUIの導入

ReactでMaterial UIならこれ！というぐらい有名で便利なライブラリです。

正直DashboardなのでわざわざMUIを導入するほどでもないのですが、操作系がMaterialで統一されていると使っていて気持ちいいので入れました。

### Tailwind CSSの導入

こちらは元々入れるつもりでした。

クラス名を自分で作成して生CSSを書いていくのは個人的に好きではないので入れています。

tailwind.config.jsを生成するところまでは通常通りですが、postcssの導入がよくわからなかったため、npm-run-allでwebpackビルド時に同時にtailwind-cliも動作させてCSSをビルドしています。

### チャット

チャットの取得には以下のライブラリを使用しました。

- youtube-chat（レート制限なし、簡単）

- node-twitter-api-v2（Streamのv2が使える、更新が新しい）

- discord.js（いつもの）

TwitterのStreamはこのコードを参考にしました。

また、チャットの一つのメッセージに対して以下のような型を用意し、使いまわせる関数を作成することでどのサービスでも簡単に追加できるようになりました。

```typescript
export type Msgs = {
    id?: string;
    createdAt: string;
    text: string;
    service: string;
    user: {
        name?: string;
        screenName: string;
        profileImageUrl: string | undefined;
    };
}[];
```

### 広告

これを作り始める前に別で作っていたのですが、それはanimate.cssを使ってクラスを付け替えするようなプログラムだったのでどのように移植するか悩みました。

が、swiper.jsを使えば簡単に行ける気がしたので入れたら簡単に行けてしまいました。

なぜ最初からこれをやらなかったのか。

## 問題点

### 更新とstate

チャットを追加する前は特に問題なく画面が更新されていたのですが、チャットを追加した後正常に更新されなくなってしまいました。

データの更新回数が多すぎたのかもしれませんが、これでは困ります。

ひとまずuseStateを1秒毎に更新させることで強制的に再レンダリングされるようになりました。

これでよかったのだろうか...

### webpackが遅い

これは今に始まった問題ではありませんが、webpackのビルドが遅く感じます。

graphicsは5秒ぐらいでビルドしてくれますが、dashboardは10秒ぐらいビルドに時間がかかるので少し辛かったです。

どうやらViteでもできそうなので、早くwebpackから移行したいです。

### 値変更

短期間で制作したためあまり作りこめておらず、後からの値変更ができない状態でした。

イベントの時刻を前にずらそうと思った時に、一度すべてのイベントを削除して作り直すのは手間でした。

これも次回までの改善点です。

## まとめ

今回製作したレイアウトは実際にVCborn夏祭りで使用されました。

https://www.youtube.com/watch?v=6AaHzDJuoT8&t=2s

本番中にエラー吐いたりしなくて安心しました。

次回のイベント用にもう少し改良していきたいです。
