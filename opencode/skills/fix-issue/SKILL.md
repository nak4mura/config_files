---
name: fix-issue
description: GitHub の Issue を分析して修正する
disable-model-invocation: true
---

$ARGUMENTS で指定された GitHub Issue を分析し修正する。
1. `gh issue view` で Issue 詳細を取得
2. `feature/<任意の名称>`ブランチを作成し、その中で実装を行う
3. 問題を理解し、関連ファイルを検索
4. 期待される入出力に基づき、テストから作成する
5. テストを実行し、失敗を確認する
6. コミットする
7. Issue の問題が解消し、テストをパスする実装を進める
8. コミットする
9. `gh pr create` で `develop` ブランチへ PR 作成

- 注意点
  - 実装中はテストを変更せず、コードを修正し続ける
  - すべてのテストが通過するまで繰り返す
