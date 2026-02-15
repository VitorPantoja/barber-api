---
name: project-structure
description: Strict Hexagonal Architecture (Ports & Adapters) with Rich Domain
priority: CRITICAL
parent_skill: backend-specialist
---

# Project Structure & Architectural Rules

## 🏗️ High-Level Directory Tree

The project is divided into 3 strict layers based on the Dependency Rule.

```text
src/
├── core/                        # 🟢 PURE TYPESCRIPT (No NestJS, No DB, No HTTP)
│   ├── domain/                  #    The Truth (Entities, Errors, Logic)
│   │   ├── entities/            #      -> User.ts (Rich Model)
│   │   ├── enums/               #      -> UserStatus.ts
│   │   ├── events/              #      -> UserCreatedEvent.ts
│   │   ├── exceptions/          #      -> InvalidEmailError.ts
│   │   └── repositories/        #      -> IUserRepository.ts (Interface only)
│   │
│   └── application/             # 🟡 THE ORCHESTRATOR
│       ├── dtos/                #      -> CreateUserDTO.ts (Input Schema)
│       ├── ports/               #      -> IEmailGateway.ts, IStorageService.ts
│       ├── queries/             #      -> (Optional) For optimized Reads
│       └── services/            #      -> UserApplicationService.ts (Command Handlers)
│
├── infrastructure/              # 🔴 THE IMPLEMENTATION (NestJS, Prisma, Express)
│   ├── config/                  #    -> Env Validation
│   ├── database/                #    -> Prisma/TypeORM
│   │   ├── mappers/             #      -> PrismaUserMapper.ts
│   │   └── repositories/        #      -> PrismaUserRepository.ts (Implements Domain Repo)
│   ├── http/                    #    -> REST / GraphQL
│   │   ├── controllers/         #      -> UserController.ts
│   │   └── presenters/          #      -> UserPresenter.ts (Response Formatting)
│   └── adapters/                #    -> ResendEmailAdapter.ts (Implements Port)
│
└── main.ts
```
