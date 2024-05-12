---
title: 'Hugo Updater'
category: 'Software'
pubDate: '2020-02-02'
updatedDate: '2022-01-26'
heroImage: '../../../assets/images/2020/hugo-updater/program.png'
---

## 機能

HugoのGithub Releasesから最新バージョンのファイルをダウンロードし、自動でアップデートしてくれるものです。

## コード

```python
import PySimpleGUI as sg
import os
import sys
import zipfile
import shutil
import glob
import subprocess
import tarfile
from subprocess import check_output
import requests
import json
import platform
import urllib.request
json_url = "https://api.github.com/repos/gohugoio/hugo/releases/latest"
json_data = requests.get(json_url)
# print(json_data.text)
with open('hugo_version.json', mode='w') as json_file:
    json_file.write(json_data.text)
version_file = json.loads(json_data.text)
# print(version_file)
hugo_newest = version_file["name"]
machine_type = platform.architecture()
machine_type = machine_type[0]
OS = platform.system()
if OS == "Darwin":
    OS = "macOS"

os.remove('hugo_version.json')
sg.theme('Material 2')

if OS == "Windows":
    out = check_output(["hugo", "version"])
    out = out.decode()
    if "extended" in out:
        out = out[5:12]
        ex = "y"

    else:
        out = out[5:12]
        out = out.decode()

else:
    res = subprocess.run(["hugo", "version"], stdout=subprocess.PIPE)
    res = res.stdout.decode().strip().split('\n')[0]
    out = res
    if "extended" in out:
        out = res[5:12]
        ex = "y"

    else:
        out = res[5:12]
        out = out.decode()

hugo_newest_k = hugo_newest[3:]
hugo_out = out[3:]
hugo_newest_v = hugo_newest[1:]

if hugo_newest_k > hugo_out:
    layout = [
        [sg.Text('新しいバージョンがあります！')],
        [sg.Text('更新しますか？')],
        [sg.Submit(button_text='はい'), sg.Submit(button_text='いいえ')]
    ]

    window = sg.Window('Hugo Updater', layout)

    while True:
        event, values = window.read()

        if event is None:
            exit()

        if event == 'はい':
            hugo_path = sg.popup_get_folder('Hugoのあるフォルダを入力して下さい', title="Hugo Updater")

            break

        if event == 'いいえ':
            exit()

    window.close()

    if OS == "Windows":
            if hugo_path is None:
                exit()
            sg.popup('処理を開始します。アプリケーションを終了しないでください。', title="Hugo Updater")
            if ex == "y":
                url = "https://github.com/gohugoio/hugo/releases/download/" + hugo_newest + "/hugo_extended_" + hugo_newest_v + "_Windows-" + machine_type + ".zip"
                save_name = hugo_path + "/hugo_extended_" + hugo_newest_v + "_Windows-" + machine_type + ".zip"
            else:
                url = "https://github.com/gohugoio/hugo/releases/download/" + hugo_newest + "/hugo_" + hugo_newest_v + "_Windows-" + machine_type + ".zip"
                save_name = hugo_path + "/hugo_" + hugo_newest_v + "_Windows-" + machine_type + ".zip"
                
            urllib.request.urlretrieve(url, save_name)
            with zipfile.ZipFile(save_name) as existing_zip:
                existing_zip.extractall(hugo_path + "/temp/")
            shutil.copy(hugo_path + "/temp/hugo.exe", hugo_path + "/")
            shutil.copy(hugo_path + "/temp/LICENSE", hugo_path + "/")
            shutil.copy(hugo_path + "/temp/README.md", hugo_path + "/")
            shutil.rmtree(hugo_path + "/temp/")
            os.remove(save_name)
            sg.popup('処理が終了しました。', title="Hugo Updater")

    elif OS == "macOS":
        if hugo_path is None:
                exit()
        sg.popup('処理を開始します。アプリケーションを終了しないでください。', title="Hugo Updater")
        if ex == "y":
            url = "https://github.com/gohugoio/hugo/releases/download/" + hugo_newest + "/hugo_extended_" + hugo_newest_v + "_Windows-" + machine_type + ".tar.gz"
            save_name = hugo_path + "/hugo_extended_" + hugo_newest_v + "_macOS-" + machine_type + ".tar.gz"
        else:
            url = "https://github.com/gohugoio/hugo/releases/download/" + hugo_newest + "/hugo_" + hugo_newest_v + "_Windows-" + machine_type + ".tar.gz"
            save_name = hugo_path + "/hugo_" + hugo_newest_v + "_macOS-" + machine_type + ".tar.gz"
                
        urllib.request.urlretrieve(url, save_name)
        from tkinter import filedialog
        # 処理フォルダ指定
        path = 'C:'
        dir_path = hugo_path
        argvs = sys.argv

        #フォルダpathを取得する。
        path = os.path.dirname(dir_path)
        
        # 特定のディレクトリをなめる
        def files(path):
            for pathname, dirnames, filenames in os.walk(path):
                for filename in filenames:
                    yield os.path.join(pathname, filename)
        
        # tarボールの解凍
        def extract_tar_file(dirname, path):
            with tarfile.open(path, 'r:*') as tar:
                tar.extractall(dirname)
        
        if __name__ == '__main__':
            for path in files(path):
                if path.endswith('.tar.gz'):
                    path = path.replace('\\','/')
                    # tarボールを保存している一つ一つのディレクトリ抽出
                    dirname, basename = os.path.split(path)
                    extract_tar_file(dirname + '/temp', path) 
        shutil.copy(hugo_path + "/temp/hugo.exe", hugo_path + "/")
        shutil.copy(hugo_path + "/temp/LICENSE", hugo_path + "/")
        shutil.copy(hugo_path + "/temp/README.md", hugo_path + "/")
        shutil.rmtree(hugo_path + "/temp/")
        os.remove(save_name)
        sg.popup('処理が終了しました。', title="Hugo Updater")

    else:
        sg.popup('残念ながらお使いのOSは対応していません。', title="Hugo Updater")

else:
    sg.popup('アップデートはありません。', title="Hugo Updater")
    exit()
```

## 説明と解説

元はこちらの投稿です。

https://yayoimizuha.web.app/hugo-updater/

コードは見やすさより便利さを優先しました。  
割と見づらいと思います。

### 使い方

0. Python3をインストール
1. Hugo-Updater.zipをダウンロード
2. hugo-updarter.pyを実行

### 仕組み

1. マシン情報とバージョンを確認
2. OSに合わせたファイルをTempフォルダにダウンロード
3. 解凍
4. コピー、上書き
5. Tempフォルダ削除
6. 完了

### 更新

**20/02/03**  
extended版を追加しました。

**20/07/06**  
GUIにしました。  
あと、Linuxのサポートを打ち切りました。

### ダウンロード

https://dl.wmsci.com/dl/software/Hugo-Updater.zip
