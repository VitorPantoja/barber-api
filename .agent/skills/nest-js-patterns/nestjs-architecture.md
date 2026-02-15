---
name: nestjs-architecture
description: High-performance Result Pattern and Layered Architecture for NestJS
priority: CRITICAL
parent_skill: backend-specialist
---

# NestJS Architecture & Patterns (Result-First)

## 🏗️ Layer Responsibilities

| Layer            | Responsibility                                             | Throws?                            |
| ---------------- | ---------------------------------------------------------- | ---------------------------------- |
| **Services**     | Return `Result<T>`, never throw HTTP exceptions.           | Infrastructure failures only.      |
| **Controllers**  | Map `Result` → HTTP via `mapResultToHttp`.                 | Never.                             |
| **Repositories** | Normalize Data Transfer Objects/Entities to Domain Shapes. | Infrastructure failures only.      |
| **Guards**       | Infrastructure/Access violations.                          | Yes (HTTP Unauthorized/Forbidden). |

## 🔄 The Result vs Exception Pattern

### Core Principle

**Exceptions are violations of the execution model, not business outcomes.**

- **Business outcomes** (Not Found, Already Exists, Validation) → Return `Result`.
- **System failures** (Database Down, Timeout, Memory Corruption) → `throw`.

### ResultKind Reference & HTTP Mapping

| ResultKind       | Meaning                              | HTTP    |
| ---------------- | ------------------------------------ | ------- |
| `SUCCESS`        | Operation completed successfully     | 200/201 |
| `NOT_FOUND`      | Requested resource does not exist    | 404     |
| `ALREADY_EXISTS` | Business constraint: duplicate entry | 409     |
| `ERROR`          | Unexpected business logic failure    | 500     |

> **Performance Note:** Avoiding exceptions for flow control prevents V8 stack unwinding and allows better function inlining.

## 💾 Repository & Data Rules

- **Normalization:** Repositories MUST return domain-friendly structures (Entities/Classes), never raw database driver artifacts.
- **Persistence Decoupling:** Services should not know about underlying database types (e.g., specific ID formats or query metadata).
- **Encapsulation:** Export Services and Repositories; keep database models/schemas internal to their respective modules.

## 📝 DTOs vs Interfaces

- **DTOs (`domain/dto/**`):\*\* Used for external input validation (Zod/Class-Validator) and API documentation (Swagger).
- **Interfaces (`application/interfaces/**`):\*\* Used for internal contracts, application logic, and named parameters.
- **Rule:** Prefer interfaces for internal service-to-service communication to keep the core clean.

## 🛠️ Code Style & Control Flow

- **Guard Clauses:** Mandatory. Keep the "Happy Path" at indentation level 0-1.
- **Try-Catch:** Use ONLY for operations with side effects, multi-step transactions, or complex cleanups. Avoid in standard CRUD flows.
- **Function Parameters:** Functions with 2+ parameters MUST use a single object with typed destructuring.

---

## 🔴 Implementation Checklist (Self-Check)

- [ ] Does the Service throw any `HttpException`? (**FIX:** Return `Result` instead)
- [ ] Is the Controller containing business logic? (**FIX:** Move to Service)
- [ ] Is the Repository leaking database-specific types? (**FIX:** Map to Domain Entity)
- [ ] Is the main logic nested inside multiple `if/else` blocks? (**FIX:** Use Guard Clauses)

# NestJS Architecture: The Result Pattern

## ⚡ Performance Core Principle

**"Exceptions are for System Failures. Results are for Business Outcomes."**

Using `throw` for control flow (e.g., UserNotFound) de-optimizes V8 execution.
We strict use the `Result<T>` pattern with discriminated unions.

## 🔄 The HTTP Mapping Layer (Mandatory)

Controllers **MUST NOT** return the Result object directly. They MUST use `mapResultToHttp`.

### Standard Implementation

The project follows this exact mapping strategy in `infrastructure/http`:

```typescript
// infrastructure/http/http.consts.ts
export const httpResultMap = {
  [RESULT_KIND.SUCCESS]: (res, result) => {
    res.status(200);
    return result.data;
  },
  [RESULT_KIND.CREATED]: (res, result) => {
    res.status(201);
    return result.data;
  },
  [RESULT_KIND.NOT_FOUND]: (res, result) => {
    res.status(404);
    return { error: 'Not Found', message: result.message };
  },
  [RESULT_KIND.ALREADY_EXISTS]: (res, result) => {
    res.status(409);
    return { error: 'Conflict', message: result.message };
  },
  [RESULT_KIND.ERROR]: (res, result) => {
    res.status(500);
    return { error: 'Internal Server Error', message: result.message };
  },
};

// infrastructure/http/map-result-to-http.ts
export function mapResultToHttp(res: NestResponseLike, result: Result<T>) {
  const handler = httpResultMap[result.kind];
  if (!handler)
    return httpResultMap[RESULT_KIND.ERROR](res, {
      message: 'Unknown Result Kind',
    });
  return handler(res, result);
}
```
