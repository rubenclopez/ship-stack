# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Permissions & Sandbox

This project runs Claude Code in sandbox mode with the following constraints:

- **Allowed without prompt:** `npm run *`, `git status`, `git diff *`, `git log *`
- **Requires confirmation:** `git push *`
- **Denied:** access to parent directories (`../`), `.env`/`.env.*`/`secrets/`, `rm -rf`, `curl`, `git push --force`
- **Network:** restricted to `github.com` and `*.npmjs.org`

## Creator

Ruben Lopez