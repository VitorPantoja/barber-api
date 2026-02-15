# ✂️ Barber API

API backend para um **SaaS de Agendamento para Barbearias** — um marketplace onde clientes descobrem barbearias, exploram catálogos de serviços e reservam horários online.

---

## 📐 Princípios Arquiteturais

O projeto segue **Arquitetura Hexagonal (Ports & Adapters)** combinada com **DDD Tático**.
A regra principal é simples: **dependências sempre apontam para dentro**.

```
Infrastructure  →  Application  →  Domain
  (NestJS)        (orquestração)    (regras de negócio puras)
```

### Por que isso importa?

| Princípio                   | Na prática                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Core puro**               | `core/domain` e `core/application` são TypeScript puro — zero imports de NestJS, Prisma ou qualquer framework.                          |
| **Inversão de dependência** | O domínio define _interfaces_ (ports). A infra implementa (adapters). Trocar o banco, o auth ou o gateway de pagamento não toca o core. |
| **Rich Domain**             | Entidades possuem comportamento e validações internas — não são apenas DTOs anêmicos.                                                   |
| **Result Pattern**          | Use-cases retornam `Result<T>` em vez de lançar exceções, tornando fluxos de erro explícitos e tipados.                                 |

---

## 📂 Estrutura de Diretórios

```
src/
├── core/                        # 🟢 TYPESCRIPT PURO (sem frameworks)
│   ├── domain/
│   │   ├── entities/            #   → Modelos ricos (User, Booking, Barbershop...)
│   │   ├── enums/               #   → Enums de domínio (BookingStatus, DayOfWeek...)
│   │   ├── errors/              #   → Erros específicos do domínio
│   │   ├── repositories/        #   → Interfaces (Ports de saída)
│   │   └── services/            #   → Domain Services
│   │
│   └── application/
│       ├── commands/            #   → Comandos de entrada (input dos use-cases)
│       ├── ports/               #   → Interfaces de serviço (Ports de entrada)
│       └── services/            #   → Application Services (orquestram o domínio)
│
├── infrastructure/              # 🔴 CAMADA DE IMPLEMENTAÇÃO (NestJS + drivers)
│   ├── decorators/              #   → Decorators customizados
│   ├── filters/                 #   → Exception filters
│   ├── guards/                  #   → Auth guards
│   ├── http/                    #   → Controllers + Presenters
│   ├── interceptors/            #   → Interceptors
│   ├── mappers/                 #   → DB ↔ Domain converters
│   ├── middleware/              #   → Middlewares
│   ├── modules/                 #   → Módulos NestJS (DI wiring)
│   └── repositories/           #   → Implementações concretas dos Ports
│
├── app.module.ts                # Root module
└── main.ts                      # Bootstrap
```

---

## 🧠 Domínio

### Entidades Principais

| Entidade              | Descrição                                                                              |
| --------------------- | -------------------------------------------------------------------------------------- |
| **User**              | Cliente ou membro da barbearia. Roles: `ADMIN`, `COMPANY_ADMIN`, `BARBER`, `CUSTOMER`. |
| **Barbershop**        | Tenant — cada barbearia é isolada. Possui slug, endereço, tema, status de assinatura.  |
| **BarbershopService** | Serviço do catálogo (ex: "Corte", "Barba") com preço em centavos e duração em minutos. |
| **OperatingHours**    | Horários de funcionamento por dia da semana.                                           |
| **Booking**           | Agregado central: liga User + Barbershop + Service + TimeSlot.                         |

### Regras de Negócio Críticas

- **Sem sobreposição** — agendamentos nunca podem conflitar para o mesmo barbeiro/slot.
- **Sem agendamento no passado** — validação temporal obrigatória.
- **Isolamento de tenant** — dados são sempre escopados à barbearia.
- **Soft delete** — serviços do catálogo usam `deletedAt` para manter integridade com bookings existentes.

---

## 🛠️ Stack Tecnológica

| Camada         | Tecnologia                          | Versão | Propósito                                  |
| -------------- | ----------------------------------- | ------ | ------------------------------------------ |
| **Runtime**    | Node.js                             | 22+    | Ambiente de execução                       |
| **Framework**  | NestJS                              | 11     | Estrutura modular, DI, decorators          |
| **Linguagem**  | TypeScript                          | 5.7    | Tipagem estática no core e infra           |
| **ORM**        | Prisma                              | 7      | Schema-first, migrations, type safety      |
| **Banco**      | PostgreSQL                          | 15+    | Banco relacional principal                 |
| **Driver PG**  | `pg` + `@prisma/adapter-pg`         | —      | Adapter nativo para Prisma 7               |
| **Auth**       | better-auth                         | 1.4+   | Autenticação session-based, multi-provider |
| **Pagamentos** | Stripe                              | —      | Checkout + Webhooks para assinaturas       |
| **Validação**  | class-validator + class-transformer | —      | Validação e transformação de DTOs          |
| **Docs API**   | @nestjs/swagger                     | 11     | Documentação OpenAPI auto-gerada           |

### Ferramentas de Desenvolvimento

| Ferramenta               | Propósito                                                             |
| ------------------------ | --------------------------------------------------------------------- |
| **ESLint** (flat config) | Linting com `perfectionist` (ordenação automática) + `import-helpers` |
| **Prettier**             | Formatação consistente (single quotes, trailing commas)               |
| **Jest** + `ts-jest`     | Testes unitários e E2E                                                |
| **Supertest**            | Testes de integração HTTP                                             |

---

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** ≥ 22
- **Yarn** (gerenciador de pacotes)
- **PostgreSQL** rodando localmente ou via Docker

### 1. Clone e instale dependências

```bash
git clone <repo-url>
cd barber-api
yarn install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/barber_api?schema=public"
BETTER_AUTH_SECRET="better-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
PORT=3000
NODE_ENV="development"
```

### 3. Execute as migrations do Prisma

```bash
npx prisma migrate dev
```

### 4. Inicie o servidor

```bash
# Modo desenvolvimento (hot-reload)
yarn start:dev

# Modo produção
yarn build && yarn start:prod
```

A API estará disponível em `http://localhost:3000/api`.

### 5. Acesse a documentação Swagger

Após iniciar o servidor, acesse a documentação interativa da API em:

```
http://localhost:3000/api/docs
```

---

## 🧪 Testes

```bash
# Unitários
yarn test

# Watch mode
yarn test:watch

# Cobertura
yarn test:cov

# E2E
yarn test:e2e
```

---

## 📏 Lint & Formatação

```bash
# Lint (com auto-fix)
yarn lint

# Formatar código
yarn format
```

---

## 📖 Referências Úteis

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [better-auth Docs](https://www.better-auth.com/docs)
- [Hexagonal Architecture — Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
