# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Permissions & Sandbox

This project runs Claude Code in sandbox mode with the following constraints:

- **Allowed without prompt:** `npm run *`, `git status`, `git diff *`, `git log *`
- **Requires confirmation:** `git push *`
- **Denied:**
  - Read/write to parent directories (`../`)
  - Read, `cat`, or `grep` on `.env`, `.env.*`, `secrets/**`, `projects/**/.env*`
  - `rm -rf`, `curl`, `git push --force`, `cd ../`
  - Read/write to `restricted-files/**`
- **Network:** restricted to `github.com` and `*.npmjs.org`

## File Operations

When relocating a file — even to a new directory — always `mv` it first, then edit only the parts that need to change. Never write a new copy and delete the original.

## Creator

Ruben Lopez