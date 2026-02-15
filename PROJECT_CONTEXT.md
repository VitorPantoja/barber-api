# PROJECT CONTEXT: FSW Barber (New SaaS Platform)

> **SYSTEM IDENTITY:** Senior Backend Architect & Developer
> **PROJECT TYPE:** New SaaS Construction (Greenfield)
> **ARCHITECTURE:** Strict Hexagonal Architecture (Ports & Adapters) with Tactical DDD
> **FRAMEWORK:** NestJS (Node.js)

---

## 1. Project Objective & Domain

**Goal:** Build a high-performance, scalable Barbershop Scheduling SaaS/Marketplace from scratch.

### 🎭 Core Actors & Entities

1.  **User:** The end-customer booking a service.
2.  **Barbershop:** The tenant/establishment offering services.
3.  **Service:** Specific offering (e.g., "Haircut", "Beard Trim") with price and duration.
4.  **Booking:** The core aggregate linking User + Barbershop + Service + TimeSlot.

### 🧠 Critical Business Rules (Domain Logic)

- **Availability:** Bookings must not overlap for the same professional/slot.
- **Time Constraints:** No bookings in the past. Cancellations allowed only within a specific window (e.g., >2 hours before).
- **Tenant Isolation:** Data must be strictly scoped to the Barbershop context.
- **Payment Flow:** Integration with Stripe for reservations (Checkout & Webhooks).

---

## 2. Architectural Manifesto

We follow a **Strict Hexagonal Architecture** combined with **Tactical DDD**.

### 🏛️ The Dependency Rule (Non-Negotiable)

Dependencies flow **INWARDS**.
`Infrastructure` → depends on → `Core/Application` → depends on → `Core/Domain`.

> 🔴 **CRITICAL:** The `Core` layer (Domain/Application) MUST be Pure TypeScript. It cannot import `nestjs`, `prisma`, `mongoose`, `express`, or any external driver libraries.

### 📂 Directory Structure Strategy

```text
src/
├── core/                        # 🟢 PURE TYPESCRIPT LAYER (No Frameworks)
│   ├── domain/                  #    The Universal Truth (Enterprise Rules)
│   │   ├── entities/            #      -> Rich Models (User, Booking) with logic
│   │   ├── errors/              #      -> Domain specific errors
│   │   └── repositories/        #      -> Abstract Interfaces (Ports)
│   │
│   └── application/             # 🟡 ORCHESTRATION LAYER
│       ├── dtos/                #      -> Input/Output Data Definitions
│       ├── ports/               #      -> Inbound (Abstract Services) & Outbound (Gateways)
│       └── services/            #      -> Application Services (Command Handlers)
│
├── infrastructure/              # 🔴 IMPLEMENTATION LAYER (NestJS / Drivers)
│   ├── config/                  #    -> Environment variables
│   ├── database/                #    -> Prisma/TypeORM implementation
│   │   ├── mappers/             #      -> DB Schema <-> Domain Entity converters
│   │   └── repositories/        #      -> Concrete implementations of Domain Repositories
│   │
│   ├── http/                    #    -> API Entry Points
│   │   ├── controllers/         #      -> DTO Validation -> Call Service -> Map Result
│   │   ├── guards/              #      -> Fail-Fast Resource Validators
│   │   └── presenters/          #      -> Response formatting
│   │
│   └── modules/                 #    -> NestJS DI Wiring (The Glue)
```
