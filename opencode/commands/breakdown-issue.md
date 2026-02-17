---
description: Issueをタスク分解してtodoリストを作成
---

## コンテキスト

- 引数: $ARGUMENTS (issue番号)

## タスク

### 引数が数値の場合

1. `glab issue view $ARGUMENTS` を実行してissueの内容を取得する
2. issueの内容を分析し、実装に必要なタスクを分解する
3. `work/$ARGUMENTS` ディレクトリを作成する
4. 以下の形式で `work/$ARGUMENTS/todo.md` を作成する:

```markdown
# Issue #$ARGUMENTS: <issueタイトル>

## Issueの概要

<issueの説明をここに記載>

## タスク一覧

- [ ] タスク1: <タスク説明>
- [ ] タスク2: <タスク説明>
- [ ] ...

## 補足情報

<必要に応じて補足情報を記載>
```

5. 作成したtodo.mdのパスをユーザーに通知する

### 引数が空または数値以外の場合

1. エラーメッセージを表示する: "issue番号を指定してください。使用例: `/breakdown-issue 123`"
