---
name: api-conventions
description: API エンドポイントの設計規約。API 関連の作業時に使用。
---

API エンドポイントを作成・修正する際のルール:

- RESTful 命名規則に従う
- エラーレスポンスは統一フォーマット（`lib/api-error.ts`）を使用
- ページネーション対応のリストには `limit` と `offset` を含める
