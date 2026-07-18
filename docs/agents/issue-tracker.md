# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## Project board

Tickets are organized on an org-level GitHub Project (v2) board: **fe-patterns #1** — <https://github.com/orgs/fe-patterns/projects/1>. Requires the `project` token scope (`gh auth refresh -s project`). Every issue this repo's skills create should be added to the board so status is tracked there.

Stable IDs (capture again with `gh project field-list 1 --owner fe-patterns --format json` if they ever change):

| Thing            | ID                                |
| ---------------- | --------------------------------- |
| Project number   | `1`                               |
| Project node ID  | `PVT_kwDOEbXE884BdpwK`            |
| `Status` field   | `PVTSSF_lADOEbXE884BdpwKzhYJy80` |
| Status → Todo    | `f75ad846`                        |
| Status → In Progress | `47fc9ee4`                    |
| Status → Done    | `98236657`                        |

- **Add an issue to the board** (do this right after `gh issue create`):
  `gh project item-add 1 --owner fe-patterns --url <issue-url>` — returns the item, whose `id` you need to set status.
- **Set status**:
  `gh project item-edit --id <item-id> --project-id PVT_kwDOEbXE884BdpwK --field-id PVTSSF_lADOEbXE884BdpwKzhYJy80 --single-select-option-id <option-id>`
  New issues start at **Todo** (`f75ad846`); move to **In Progress** (`47fc9ee4`) when picked up and **Done** (`98236657`) on close.
- **List board items with status**:
  `gh project item-list 1 --owner fe-patterns --format json --jq '.items[] | {title, status: .status, content: .content.url}'`

The board is the organization layer; the triage **labels** (see `triage-labels.md`) still drive skill logic. Status column and `ready-for-*` label are complementary, not redundant.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(This is a personal project; external PRs are not treated as feature requests. Set to `yes` if that changes; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE` (drop `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either — resolve with `gh pr view 42` and fall back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.
