---
name: nest-js-patterns
description: Core engineering standards for NestJS, Architecture, Security and Tooling
priority: CRITICAL
---

# NestJS Engineering Standards

This skill defines the mandatory patterns for development in this repository.

## 📚 Modules

- **[Architecture](nestjs-architecture.md):** Layer responsibilities and the Result vs Exception pattern.
- **[Security](security-standards.md):** Rules for Guards, Decorators, and Infrastructure boundaries.
- **[Tooling](tooling.md):** Package management (Yarn) and environment rules.

## 🚀 Core Principles

1. **Result Pattern:** Business outcomes are returned, not thrown.
2. **Layered Safety:** Guards handle infra-security; Services handle business logic.
3. **Flat Indentation:** Mandatory use of Guard Clauses (Indentation 0-1).
4. **Deterministic Tooling:** Yarn is the only source of truth.

---

## 🛠️ Verification Commands

The following checks should be run to ensure compliance:

- `yarn lint`
