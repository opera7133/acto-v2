---
title: 'Oracle Customer Connectのメールがウザすぎる！'
category: 'Zakki'
pubDate: '2026-1-15'
draft: false
---

Oracle Cloudで謎の挙動に当たった時、Oracle Cloudのフォーラムが検索に引っかかることがあります。

ただしアカウント登録しないと質問・回答の全文が見えないので、必然的にアカウントを登録することになります。

しかし、設定からアカウントの通知を**すべてオフにしても**毎週イベントの通知がやってきます。

## Unsubscribeしたい

最近のマーケティングメールの規制により、これらのメールはUnsubscribeリンクを設置するかList-Unsubscribeヘッダーをつけるなどする必要があります。

つまり、ほとんどのメールマガジンはワンクリックで購読解除できるはずです。

OracleのニュースレターもちゃんとUnsubscribeリンクがあり、ちゃんとメールアドレスが記入済みの解除フォームに遷移します。

ただし、初期状態でSubmitを押しても反応しません。

![2つ目のrowのdisplay:noneを削除](../../../assets/images/2026/oracle/devtools.png)

開発者ツールを開いてフォームを選択し、`display: none`となっている`row`の2つ目から`display: none`を削除します。

![チェックボックスにチェックを入れる](../../../assets/images/2026/oracle/privacy.png)

プライバシーポリシーに同意するチェックボックスが表示されるので、チェックを入れればSubmitが押せます。
