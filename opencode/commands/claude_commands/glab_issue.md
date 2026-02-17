---
allowed-tools: Bash(glab issue:*), Bash(glab mr:*), Bash(git:*)
argument-hint: [issue番号]
description: GitLab issueを取得して対応・MR作成
---

## コンテキスト

- 引数: $ARGUMENTS

## タスク

### 引数が数値の場合

1. `glab issue view $ARGUMENTS` を実行してissueの内容を取得する
2. issueの内容を分析し、必要な改修を実施する
3. 改修完了後、適切なブランチ名で作業ブランチを作成（まだ作成されていない場合）
4. 変更をコミットする
5. `glab mr create` でマージリクエストを作成する（ターゲットブランチは `develop`）

### 引数が空または数値以外の場合

1. `glab issue list` を実行してissue一覧を表示する
2. ユーザーに対して「対応したいissueの番号を選択し、`/glab_issue <番号>` として再度実行してください」と伝える
