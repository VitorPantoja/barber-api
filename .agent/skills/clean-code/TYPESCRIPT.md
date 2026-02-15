# TypeScript / JavaScript Code Style

## Function Parameters

If a function receives two or more parameters, it MUST receive
a single object parameter with typed destructuring.

- Prefer `interface`.
- Use `type` only for complex unions or legacy code.

## Control Flow (No Deep Nesting)

- Deeply nested `if` statements are forbidden.
- Use guard clauses and early returns.
- Keep the happy path at indentation level 0–1.

## Type Validation

- Do not pollute the main flow with `typeof`, `in`, or `instanceof`.
- Extract checks into type guards or small helpers.
- Keep core logic readable.

## Helpers vs Private Methods

- If a method does not access `this`, extract it to a helper.
- Helpers MUST be pure and reusable.
- Use private methods only for orchestration tied to class state.

## File Organization (Step-Down Rule)

Order files top-down:

1. Imports
2. Interfaces / Types
3. Public functions or classes
4. Private helpers at the bottom

High-level logic comes first, details later.
