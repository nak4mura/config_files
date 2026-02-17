---
allowed-tools: mcp__playwright__*, Bash(sleep:*)
argument-hint: [URL] [回数]
description: Playwright MCPサーバーを使用してモンキーテストを実行
---

# モンキーテスト実行

Playwright MCPサーバーを使用して、指定されたURLに対してモンキーテスト（ランダムUI操作テスト）を実行してください。

## 対象URL
$1

## 実行回数
$2 回（指定がなければ10回）

## 実行手順

1. **ブラウザでURLを開く**
   - `mcp__playwright__browser_navigate` でURLにアクセス

2. **以下の操作をランダムに繰り返す**（指定回数分）:

   各イテレーションで:
   a. `mcp__playwright__browser_snapshot` でページの現在状態を取得
   b. スナップショットから操作可能な要素（ボタン、リンク、入力フィールドなど）を特定
   c. 以下からランダムに1つの操作を選択して実行:
      - **クリック**: `mcp__playwright__browser_click` でボタンやリンクをクリック
      - **テキスト入力**: `mcp__playwright__browser_type` で入力フィールドにランダムな文字列を入力
      - **ホバー**: `mcp__playwright__browser_hover` で要素にホバー
      - **キー入力**: `mcp__playwright__browser_press_key` でキーを押す（Tab, Enter, Escapeなど）
      - **スクロール**: `mcp__playwright__browser_press_key` でPageDown/PageUpを押す
   d. 操作後、1-2秒待機してページの反応を確認
   e. エラーやクラッシュが発生した場合は記録

3. **コンソールエラーの確認**
   - `mcp__playwright__browser_console_messages` でエラーレベルのメッセージを確認

4. **結果レポート**
   - 実行した操作の一覧
   - 発見したエラーや問題点
   - コンソールに出力されたエラーメッセージ

## 注意事項
- 破壊的な操作（削除ボタンなど）は避ける
- ログアウトボタンは押さない
- 外部サイトへのリンクは踏まない
- ダイアログが表示されたら `mcp__playwright__browser_handle_dialog` で適切に処理
