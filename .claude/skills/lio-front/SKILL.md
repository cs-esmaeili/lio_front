---
name: lio-front
description: TypeScript and zod conventions for the lio_front Next.js app. Use when writing or editing any *.ts/*.tsx, when adding/refactoring a *.service.ts, *.schema.ts, *.mapper.ts, *.model.ts, or when handling API data, `any`, `as` casts, or validation. Triggers on "add service", "type this", "parse API", "zod schema", "fix types".
---

# lio_front TypeScript + zod rules

Applies to all source under `app/`, `components/`, `hooks/`, `lib/`,
`services/`, `stores/`, `utils/`, `providers/`, `typescript/`.

## TypeScript

- `any` is forbidden. External/untrusted data is `unknown` and must be
  narrowed with a type guard or parsed with zod before use.
- `as` casts are forbidden for API/external data. A cast is only allowed after
  the value has already been validated/narrowed.
- `@ts-ignore` is forbidden. `@ts-expect-error` is allowed only with a short
  reason comment on the same line.
- Domain types come from zod via `z.infer`. Do not hand-write an interface that
  duplicates a schema.
- Hand-written types that have no schema live in `typescript/types/**`.
- **No named `interface`/`type` declarations inside component files** — not
  props, not view-models, not anything. Move them to `typescript/types/**` or
  derive from zod in `typescript/schemas/**`.
  - Only exception: an inline type literal in the same signature, e.g.
    `({ id }: { id: number })` or `useState<Foo | null>(null)`.
- Import with the `@/*` alias, not deep relative paths.

## zod

- Validation happens **only at the service boundary** (`services/*.service.ts`),
  for both CSR (`clientService`) and SSR (`SSRService`). Never parse inside
  components or render.
- Use `safeParse` and throw a structured `ApiError` on failure so the existing
  interceptor and `getApiErrorMessage` keep working:
  ```ts
  const parsed = OrderSchema.safeParse(data?.data?.order);
  if (!parsed.success) {
    throw new ApiError(422, 'پاسخ سرور نامعتبر است', parsed.error);
  }
  return parsed.data;
  ```
- Schemas do both validation and transform (snake_case API → camelCase model)
  via `.transform()`. `z.infer` is the final domain model. Mappers (`*.mapper.ts`)
  become unnecessary and should be removed when a schema replaces them.
- Schemas live in `typescript/schemas/**` and are named `*.schema.ts`. Export the
  schema and its inferred type:
  ```ts
  export const OrderSchema = ApiOrderSchema.transform(toOrderModel);
  export type Order = z.infer<typeof OrderSchema>;
  ```
- Validation error messages are Persian and RTL, matching the existing schemas
  (see `typescript/schemas/address-form.schema.ts`).
- For unstable APIs, prefer `.catch()`/defaults or `.passthrough()` on optional
  fields so one new/renamed field does not break the whole page.
- `schema/` at the repo root is **SEO / JSON-LD only** — do not confuse it with
  `typescript/schemas/` (validation).

## Verification

- Run `pnpm lint && pnpm typecheck` before finishing. If `typecheck` does not
  exist, add `"typecheck": "tsc --noEmit"` to `package.json`.
- Target: zero new `any`, zero new unsafe `as`, no new named types in
  components.
