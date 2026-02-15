---
name: security-standards
description: Strict rules for Guards, Decorators and Infrastructure Security
priority: CRITICAL
parent_skill: backend-specialist
---

# Security Rules: Guards & Decorators

## 🛡️ Strict Separation of Concerns

### 1. Guards (The Gatekeepers)

**Location:** `src/infrastructure/guards/**`

- **Role:** Implement `CanActivate` to validate route preconditions before they reach the controller.
- **Exceptions:** Guards are the ONLY layer where throwing HTTP Exceptions is the standard (e.g., `UnauthorizedException`, `ForbiddenException`).
- **Dependencies:** MUST use NestJS Dependency Injection for services/configs.

**When to throw in Guards:**

- Invalid/Expired Tokens.
- Lack of specific Permissions/Roles.
- Missing mandatory Headers or Metadata.

### 2. Decorators (The Interface)

**Location:** `src/infrastructure/decorators/**`

- **Role:** Provide a clean, declarative API for the developer (e.g., `@RequirePermission('READ_USER')`).
- **Constraint:** Decorators **MUST NOT** contain business or security logic. They only attach metadata or compose `UseGuards`.
- **Composition:** Use `applyDecorators` to group multiple guards or metadata markers.

## 🏗️ Folder Structure Enforcement

```text
src/
└── infrastructure/
    ├── guards/      # Implementation (Logic + DI)
    └── decorators/  # Declarative API (Metadata only)
```

# Security & Validation Standards

## 🛡️ Guards Strategy

We divide guards into two categories:

### 1. Security Guards (Auth/RBAC)

- Standard JWT/Passport strategies.
- Check **Who** the user is.

### 2. Resource Precondition Guards (The "Fail Fast" Pattern)

- Check **If** the resource exists/is valid before the Controller/Service executes.
- **Allowed:** Inject Repositories (Interfaces) into these Guards.
- **Goal:** Keep Controllers clean of `if (!exists)` logic.

**Template Pattern (Abstract Class):**
Use an abstract `ValidateDocumentStatusGuard` to enforce consistency:

1. `checkDocumentStatus(id)`: Returns `{ exists, canProceed }`.
2. `getResourceName()`: Returns friendly name for errors.

## 🎀 Decorators

Decorators are the **Public API** for your Guards.
Always use `applyDecorators` to combine Metadata + UseGuards.

```typescript
// ✅ CORRECT
export function ValidateRelatorioExists() {
  return applyDecorators(
    SetMetadata('validate_relatorio', true),
    UseGuards(ValidateRelatorioExistsGuard),
  );
}
```
