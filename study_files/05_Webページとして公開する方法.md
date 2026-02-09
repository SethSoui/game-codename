# 5. Webページとして公開する方法

この章では、開発したコードネーム風ゲームをインターネット上に公開し、誰でもアクセスできるWebページにする方法を解説します。
ここでは、GitHubの**GitHub Pages**という機能と、**GitHub Actions**という自動化の仕組みを組み合わせて、無料でWebサイトを公開します。

一度設定を完了すれば、今後はソースコードをGitHubにプッシュするだけで、自動的に最新版のWebサイトが公開されるようになります。

---

### Step 1: リポジトリ名を確認する

まず、あなたのGitHubリポジトリ名が必要です。
リポジトリのURLが `https://github.com/あなたのユーザー名/リポジトリ名` の場合、この `リポジトリ名` の部分をコピーしておいてください。
この後の手順で `your-repo-name` と書かれている部分を、あなたのリポジトリ名に置き換えてください。

### Step 2: Viteの設定ファイルを変更する

Viteに対して、公開されるページのURLの基礎部分（ベースパス）が、ルート `/` ではなく `/リポジトリ名/` になることを教える必要があります。

1.  `vite.config.ts` ファイルを開きます。
2.  `defineConfig` の中に `base` プロパティを追加します。

```typescript:vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // この行を追加します
  base: '/your-repo-name/', 
  plugins: [react()],
})
```
**注意**: `your-repo-name` の部分は、必ずあなたのリポジトリ名に書き換えてください。前後にスラッシュ `/` が必要です。

### Step 3: GitHub Actions の設定ファイルを作成する

次に、公開作業を自動化するための設定ファイルを作成します。

1.  プロジェクトのルートディレクトリに `.github` という名前のフォルダを作成します。
2.  その `.github` フォルダの中に `workflows` という名前のフォルダを作成します。
3.  `workflows` フォルダの中に `deploy.yml` という名前のファイルを作成し、以下の内容をそのままコピー＆ペーストしてください。

```yaml:deploy.yml
# GitHub Actionsの名前
name: Deploy to GitHub Pages

# このActionが実行されるタイミングを指定
on:
  # mainブランチにpushされたときに実行
  push:
    branches:
      - main
  # GitHubのActionsタブから手動で実行することも可能にする
  workflow_dispatch:

# Actionが実行するJob（タスク）の権限設定
permissions:
  contents: read
  pages: write
  id-token: write

# 実行するJobを定義
jobs:
  # build（ビルド）とdeploy（デプロイ）という2つのJobを定義
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20" # package.jsonなどと合わせる
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 4: GitHubリポジトリの設定を変更する

GitHubのWebサイト上で、GitHub Actionsがページをデプロイできるように設定を変更します。

1.  ブラウザであなたのGitHubリポジトリを開きます。
2.  リポジトリのタブから `Settings` をクリックします。
3.  左側のメニューから `Pages` をクリックします。
4.  `Build and deployment` の下にある `Source` のドロップダウンメニューを開きます。
5.  `Deploy from a branch` から `GitHub Actions` に変更します。

### Step 5: 変更をコミット＆プッシュする

ここまでの変更を保存し、GitHubにアップロードします。

1.  変更した `vite.config.ts` ファイルをコミットします。
2.  新しく作成した `.github/workflows/deploy.yml` ファイルをコミットします。
3.  これらの変更を `main` ブランチにプッシュします。

```shell
git add vite.config.ts .github/workflows/deploy.yml
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### Step 6: 公開を確認する

プッシュが完了すると、GitHub Actionsが自動的に実行されます。

1.  リポジトリの `Actions` タブを開くと、`Deploy to GitHub Pages` というワークフローが実行されているのが確認できます。
2.  ビルドとデプロイが成功すると、緑色のチェックマークが付きます（初回は数分かかることがあります）。
3.  再度 `Settings` > `Pages` を開くと、`Your site is live at https://あなたのユーザー名.github.io/リポジトリ名/` のように、公開されたサイトのURLが表示されています。

以上で、Webサイトの公開は完了です。お疲れ様でした！
今後、ゲームのコードを修正して `main` ブランチにプッシュするたびに、このプロセスが自動で実行され、Webサイトが更新されます。
