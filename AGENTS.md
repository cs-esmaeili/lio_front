<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Colors — token rule (enforced)

`styles/globals.css` is the only source of truth for color.

- Never use Tailwind's built-in palette (`white`, `black`, `gray-200`, `red-500`, `green-600`, ...) or inline `#hex`/`rgb()` in class names.
- `components/shadcn/**` must use only shadcn semantic tokens (`background`, `foreground`, `border`, `input`, `ring`, `primary`, `secondary`, `muted`, `accent`, `popover`, `card`, `destructive`, `success`, `sidebar*`) — never brand tokens or palette.
- All other code must use only the brand tokens directly (`primary-black-*`, `primary-0..4`, `secondary-black-*`, `secondary-1..3`, `gray-1/2/3`, `custom-*`, `wordpress-black-3`) — never shadcn semantic tokens or palette.
- A color that has no token is added in `globals.css` (`:root` + a `@theme inline` mapping), never inlined.

Full rule, mapping cheat-sheets and verification commands: `.claude/skills/theme-tokens/SKILL.md`.
