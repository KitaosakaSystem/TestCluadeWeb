# 医療系シナリオ型チャットボット FAQ システム

Reactとデータベースを使用した、カスタマイズ可能なシナリオ型チャットボットFAQシステムです。

## 特徴

- **データベース連携**: SQLiteを使用してシナリオと回答を管理
- **管理画面**: ブラウザから直接シナリオの追加・編集・削除が可能
- **HTML対応**: 回答内容にHTMLタグを使用して、リッチなコンテンツを表示
- **医療系デザイン**: さわやかな水色ベースのデザイン
- **レスポンシブ**: モバイルデバイスでも快適に利用可能

## プロジェクト構成

```
/
├── client/              # React フロントエンド
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chatbot.jsx      # チャットボット表示
│   │   │   ├── AdminPanel.jsx   # 管理画面
│   │   │   └── *.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/              # Node.js バックエンド
│   ├── index.js         # Express API サーバー
│   ├── database.js      # データベース操作
│   ├── seed.js          # 初期データ投入
│   └── package.json
├── chatbot.db           # SQLite データベース
└── README.md
```

## セットアップ

### 1. 依存関係のインストール

```bash
# バックエンド
cd server
npm install

# フロントエンド
cd ../client
npm install
```

### 2. データベースの初期化

```bash
cd server
node seed.js
```

### 3. サーバーの起動

**ターミナル1: バックエンドサーバー**
```bash
cd server
npm start
# → http://localhost:3001 で起動
```

**ターミナル2: フロントエンドサーバー**
```bash
cd client
npm run dev
# → http://localhost:5173 で起動
```

## 使い方

### チャットボット画面

1. ブラウザで `http://localhost:5173` にアクセス
2. 「💬 チャットボット」タブでチャットボットを使用
3. 表示される選択肢をクリックして会話を進める

### 管理画面

1. 「⚙️ 管理画面」タブをクリック
2. シナリオの一覧が表示される
3. 各シナリオの編集・削除が可能
4. 「➕ 新規シナリオ作成」から新しいシナリオを追加

#### シナリオの項目

- **シナリオID**: 一意の識別子（例: `login_password`）
- **メッセージ**: 短い説明文
- **HTML内容**: 詳細な回答（HTMLタグ使用可能）
- **親シナリオID**: このシナリオがどこから呼び出されるか
- **表示順序**: シナリオの表示順
- **選択肢**: ユーザーが選べるオプション

#### HTMLコンテンツの例

```html
<h3>見出し</h3>
<p>段落のテキスト</p>
<ul>
  <li>箇条書き1</li>
  <li>箇条書き2</li>
</ul>
<div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
  <p>強調したい内容</p>
</div>
```

## API エンドポイント

### シナリオ

- `GET /api/scenarios` - 全シナリオ取得
- `GET /api/scenarios/:id` - 特定シナリオ取得
- `POST /api/scenarios` - シナリオ作成
- `PUT /api/scenarios/:id` - シナリオ更新
- `DELETE /api/scenarios/:id` - シナリオ削除

### 選択肢

- `POST /api/options` - 選択肢作成
- `PUT /api/options/:id` - 選択肢更新
- `DELETE /api/options/:id` - 選択肢削除

## データベーススキーマ

### scenarios テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | TEXT | シナリオID（主キー） |
| message | TEXT | 短いメッセージ |
| html_content | TEXT | HTML形式の詳細内容 |
| parent_id | TEXT | 親シナリオのID |
| order_index | INTEGER | 表示順序 |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |

### options テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | INTEGER | オプションID（主キー） |
| scenario_id | TEXT | 所属するシナリオID |
| text | TEXT | 選択肢のテキスト |
| next_scenario_id | TEXT | 次に表示するシナリオID |
| order_index | INTEGER | 表示順序 |

## カスタマイズ

### デザインの変更

各コンポーネントのCSSファイルを編集してデザインをカスタマイズできます：

- `client/src/components/Chatbot.css` - チャットボットのスタイル
- `client/src/components/AdminPanel.css` - 管理画面のスタイル
- `client/src/App.css` - 全体のレイアウト

### 初期データの変更

`server/seed.js` を編集して初期データをカスタマイズできます。

## 技術スタック

- **フロントエンド**: React 18 + Vite
- **バックエンド**: Node.js + Express
- **データベース**: SQLite (better-sqlite3)
- **スタイリング**: CSS (モジュール化なし)

## ライセンス

MIT
