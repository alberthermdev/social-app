# Social App

## Branches

- `main` — production-ready code
- `develop` — active development (default)

Work on feature/fix branches off `develop` and merge back via PR.

## Commit Convention

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user profile screen
fix: resolve login crash on Android
docs: update README setup section
refactor: extract theme hook
chore: bump dependencies
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `ci`.

## Code Quality

Before submitting any code, always run:

- `npm run typecheck` — TypeScript compilation check
- `npm run lint` — ESLint check
- `npm run format:check` — Prettier formatting check

To auto-fix issues: `npm run lint:fix && npm run format`

## Environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

## Expo

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.
