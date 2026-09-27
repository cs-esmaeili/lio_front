---
name: theme-tokens
description: Color-token rules for lio_front. Use whenever adding or changing a color/className, editing styles/globals.css, or touching components/shadcn. Triggers on "color", "theme", "palette", "bg-", "text-", "border-", "globals.css", "tokens", "dark mode".
---

# lio_front color tokens

`styles/globals.css` is the **only** source of truth for color. Everything else
references it. Changing a brand variable there must update the whole app.

## The two layers

**1. Brand layer** — raw palette in `:root`, exposed to utilities in `@theme inline`:

```
primary-black-2, primary-black-1, primary-1, primary-2, primary-3, primary-4,
primary-0, c-primary-1, secondary-black, secondary-black-3, secondary-black-2,
secondary-black-1, secondary-1, secondary-2, secondary-3, wordpress-black-3,
gray-3, gray-2, gray-1, custom-purple, custom-yellow, custom-green, custom-red,
custom-white
```

Utilities: `bg-primary-1`, `text-secondary-2`, `border-gray-2`, `bg-custom-white`,
`text-custom-red`, ... (`gray-1/2/3` here are **brand tokens**, not Tailwind gray.)

**2. shadcn layer** — semantic aliases mapped to the brand layer:

```
background, foreground, card(-foreground), popover(-foreground),
primary(-foreground), secondary(-foreground), muted(-foreground),
accent(-foreground), destructive, success, border, input, ring,
chart-1..5, sidebar*
```

Mapping examples in `globals.css`:

```css
--primary: var(--primary-1);
--background: var(--custom-white);
--border: var(--gray-2);
--input: var(--gray-2);
--ring: var(--primary-1);
--muted: var(--gray-1);
--muted-foreground: var(--secondary-2);
--accent: var(--primary-2);
--destructive: var(--custom-red);
--success: var(--primary-0);
```

## Rules

- **R1 — never use Tailwind's built-in palette.** No `white`, `black`,
  `slate-*`, `gray-50..950`, `red-*`, `orange-*`, `amber-*`, `yellow-*`,
  `green-*`, `emerald-*`, `teal-*`, `cyan-*`, `sky-*`, `blue-*`, `indigo-*`,
  `violet-*`, `purple-*`, `fuchsia-*`, `pink-*`, `rose-*` in any `className`.
  No `#hex` / `rgb()` / `hsl()` outside `globals.css` token definitions.
- **R2 — `components/shadcn/**` uses the shadcn layer only.** Never brand tokens
  (`primary-1`, `gray-2`, `custom-white`, ...), never the built-in palette. If a
  semantic token is missing (e.g. `success`), add it in `globals.css` and map it
  to a brand variable — do not reach for a brand token directly.
- **R3 — everything else uses the brand layer only.** App code
  (`app/`, `components/**` except `components/shadcn/`, `hooks/`, ...) must not
  use shadcn semantic utilities (`bg-background`, `text-foreground`,
  `border-border`, `text-destructive`, `ring-ring`, ...). Use the brand utility.
- **R4 — colors are defined, not inlined.** A new color goes in `:root` + a
  `@theme inline` mapping in `globals.css`. Then use it.

## Brand cheat-sheet (app code — R3)

| need | use |
| --- | --- |
| surface (white) | `bg-custom-white` |
| subtle surface | `bg-gray-1` |
| border | `border-gray-1` / `border-gray-2` / `border-gray-3` |
| heading / strong text | `text-secondary-black-3` |
| body text | `text-secondary-1` |
| muted text | `text-secondary-2` / `text-secondary-3` |
| brand red | `bg-primary-1` / `text-primary-1` |
| brand red tint | `bg-primary-4` |
| strong red | `bg-primary-2` / `text-primary-2` |
| danger | `text-custom-red` / `bg-custom-red/10` |
| success green | `text-custom-green` / `bg-primary-0` |
| focus ring | `ring-primary-1/50` |
| white on brand | `text-custom-white` |

## shadcn cheat-sheet (R2)

| need | use |
| --- | --- |
| surface | `bg-background` |
| popover/menu surface | `bg-popover` |
| text | `text-foreground` / `text-muted-foreground` |
| border / input | `border-border` / `border-input` |
| focus ring | `ring-ring` |
| primary action | `bg-primary text-primary-foreground` |
| danger | `bg-destructive text-destructive` |
| success | `bg-success` |
| scrim/overlay | `bg-foreground/10` |

## Verify before finishing

```bash
pnpm lint && pnpm typecheck
```

No built-in palette anywhere (must be empty):

```bash
rg -nP '(bg|text|border|ring|from|to|via|fill|stroke|outline|divide|placeholder|caret|accent|decoration)-(white|black|(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3})(?![\w-])' app components
```

No brand tokens inside `components/shadcn/` (must be empty):

```bash
rg -nP '(bg|text|border|ring|from|to|via|fill|stroke|outline|divide|placeholder|caret|accent|decoration)-(primary-black-[12]|primary-[0-4]|c-primary-1|secondary-black-[123]|secondary-[123]|gray-[123]|wordpress-black-3|custom-(white|yellow|purple|red|green))(?![\w-])' components/shadcn
```

No shadcn semantic utilities in app code (must be empty outside `components/shadcn/`):

```bash
rg -nP '(bg|text|border|ring|from|to|via|fill|stroke|outline|divide|placeholder|caret|accent|decoration)-(background|foreground|card-foreground|card|popover-foreground|popover|primary-foreground|primary|secondary-foreground|secondary|muted-foreground|muted|accent-foreground|accent|destructive|success|border|input|ring)(?![\w-])' app components --glob '!components/shadcn/**'
```
