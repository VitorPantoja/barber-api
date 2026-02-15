---
name: tooling-standards
description: Strict package management and environment constraints
priority: CRITICAL
---

# Tooling & Environment Rules

## 📦 Package Manager (STRICT)

- **Single Source of Truth:** `yarn.lock` is the ONLY valid lockfile.
- **Mandatory Tool:** **Yarn** is the only allowed package manager.

### 🚫 Forbidden Tools

Do NOT use or execute commands from:

- `npm` (No `package-lock.json`)
- `pnpm` (No `pnpm-lock.yaml`)
- `bun` (unless explicitly requested)

> **Rule:** If you need to install a dependency, use `yarn add`. If you need to run a script, use `yarn <script>`.

## 🛠️ Execution & Safety

- **Scripts:** Always check `package.json` for existing scripts before suggesting a new one.
- **Environment:** Before suggesting code that uses `process.env`, check if the variable is documented in `.env.example`.

---

## 🔴 Enforcement Protocol (Mental Checklist)

- [ ] Am I about to run an `npm` command? (**STOP:** Use `yarn`)
- [ ] Did a `package-lock.json` appear after my action? (**FIX:** Delete it and update `yarn.lock`)
- [ ] Is this new dependency necessary according to **YAGNI**?
