# <プロジェクト名>

プロジェクトの全体像を1~2行で示す。

## ディレクトリ構成

- `/app`: App Router のページとレイアウト
- `/app/components/ui`: 再利用可能な UI コンポーネント
- `/app/api`: API ルート
- `/server/domain`: ドメイン層(エンティティ、値オブジェクト、ドメインサービス)
- `/server/application`: アプリケーション層(ユースケース、アプリケーションサービス)
- `/server/infrastructure`: インフラストラクチャ層(リポジトリ実装、DB接続)
- `/tests`: テスト

## 開発コマンド

- `pnpm dev`: 開発サーバー起動（Turbopack、ポート 3000）
- `pnpm test`: Vitest による単体テスト
- `pnpm test:e2e`: Playwright による e2e テスト
- `pnpm lint`: ESLint 実行
- `pnpm db:migrate`: Prisma マイグレーション実行
- `pnpm db:seed`: テストデータ投入

## 詳細ドキュメント(常にコンテキストとして読み込む必要のない情報を@インポートで読み込む)

- アーキテクチャ: @docs/architecture.md
- 環境依存情報: @docs/envspecific.md
- 認証情報: @docs/auth-info.md

