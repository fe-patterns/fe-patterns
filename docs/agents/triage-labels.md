# Triage Labels

The skills speak in terms of five canonical triage roles. This repo is a
personal project with no external reporter flow, so only the two "ready"
states are actively used. The incoming-triage states are kept here at their
default strings in case they're ever needed.

| Canonical role    | Label in our tracker | Active? | Meaning                                  |
| ----------------- | -------------------- | ------- | ---------------------------------------- |
| `needs-triage`    | `needs-triage`       | unused  | Maintainer needs to evaluate this issue  |
| `needs-info`      | `needs-info`         | unused  | Waiting on reporter for more information |
| `ready-for-agent` | `ready-for-agent`    | **yes** | Fully specified, ready for an AFK agent  |
| `ready-for-human` | `ready-for-human`    | **yes** | Requires human implementation            |
| `wontfix`         | `wontfix`            | unused  | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the
corresponding label string from this table. Edit this file if you start using
the other states.
