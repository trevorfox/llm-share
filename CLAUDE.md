# Repo norms — llm-share

The open-source share-to-LLM widget and detection module (`@trevorfox/llm-share`).
Public repo, npm package, self-hostable. The hosted CDN build at
`cdn.getsourced.ai` is a separate deployment of this same source.

**Open core is deliberate.** This package must keep working standalone, with no
Sourced account and no hosted endpoint. Do not add anything that assumes the
paid product exists, and keep the collector contract documented in the README so
self-hosters can point at their own endpoint.

## Specs live in the knowledge graph

Behavior specs for this package are nodes in the private **getsourced-knowledge**
graph. Attach it before working on spec-grade code:

```
claude --plugin-dir ../getsourced-knowledge
```

**Spec-grade nodes covering this repo:**

| Node | Covers |
|---|---|
| `/features/event-collector-api` | the `/v1` contract this package speaks |
| `/features/detect-module` | detect semantics and defaults |

**Description-grade:** `/features/llm-share-widget`, `/features/widget-builder`.
Context, not contract.

## The rules

**1. Read before you change.** Touching `src/` in a way that alters the wire
contract, detect behavior, or config defaults? Read the node first.

**2. On a discrepancy, STOP AND ASK.** If code and spec disagree, present both
and ask which is wrong. Never silently change either side to match the other.

**3. A spec change is its own commit,** before the implementation.

**4. Done means:** code + node updated + `npx spandrel compile ./knowledge`
clean in the graph repo, in the same PR.

Exploratory work is exempt — write the spec after you understand the thing.

## Gotchas

- **`dist/` is gitignored AND untracked. Do not re-commit it.** Tracked stale
  artifacts once made the GitHub Pages demo serve a seven-month-old build.
- **CI gates on `test:run` only** — lint and typecheck are NOT in the workflow.
  Run them locally before pushing.
- **Detect defaults on in hosted mode only.** Standalone and self-hosted opt in.
- Two deploy paths fire per push to `main`: "Deploy Widget CDN" (Vercel) and
  GitHub Pages.
