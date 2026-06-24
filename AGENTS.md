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

## EAS Build

Build profiles defined in `eas.json`:

| Profile       | App Name           | Bundle ID               | Distribution          |
| ------------- | ------------------ | ----------------------- | --------------------- |
| `development` | Social App Dev     | `com.socialapp.dev`     | Internal (dev client) |
| `preview`     | Social App Staging | `com.socialapp.staging` | Internal (APK)        |
| `production`  | Social App         | `com.socialapp`         | Store                 |

Build commands:

```bash
eas build --profile development --platform all
eas build --profile preview --platform android
eas build --profile production --platform all
```

## Expo

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.
