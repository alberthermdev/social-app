# Social App

A cross-platform social messaging application built with React Native and Expo.

## Tech Stack

- **Framework:** React Native (0.85) via Expo SDK 56
- **Language:** TypeScript (6.0)
- **Navigation:** React Navigation 7 (native-stack + bottom-tabs)
- **State:** Zustand 5
- **Data Fetching:** TanStack React Query 5
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Forms:** React Hook Form + Zod
- **Internationalization:** i18next + react-i18next
- **UI:** Custom component library with dynamic theming

## Architecture

```
src/
├── app/              # App shell (navigation, stores, providers)
│   ├── navigation/   # Stack navigators and route types
│   ├── stores/       # Zustand stores (auth, settings, privacy)
│   └── providers/    # React context providers
├── core/             # Firebase initialization and config
├── features/         # Feature modules (clean architecture)
│   ├── auth/
│   ├── chats/
│   ├── contacts/
│   ├── messages/
│   └── profile/
│       ├── application/   # Use cases
│       ├── domain/        # Entities and repository interfaces
│       ├── infrastructure/ # Firebase repository implementations
│       └── presentation/  # Screens grouped by feature
└── shared/           # Shared UI components, hooks, theme, utils
    ├── components/   # Reusable components (folder per component)
    ├── hooks/        # Custom hooks (useTheme, useDebounce, etc.)
    └── theme/        # Colors, spacing, typography tokens
```

### Component Structure

Each shared component follows a consistent folder pattern:

```
ComponentName/
├── ComponentName.tsx   # Component logic
├── styles.ts           # Extracted styles (createStyles for dynamic themes)
└── index.ts            # Public export
```

### Feature Structure

Each feature follows clean architecture:

```
feature/
├── application/    # Use cases / business logic
├── domain/         # Entities, repository interfaces
├── infrastructure/ # Firebase/Firestore implementations
└── presentation/   # Screens (screen folder with styles + index)
```

## Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- A Firebase project (copy `.env.example` to `.env` and fill credentials)

### Installation

```bash
npm install
npx expo start
```

### Scripts

| Script              | Description                   |
| ------------------- | ----------------------------- |
| `npm start`         | Start Expo dev server         |
| `npm run ios`       | Start on iOS simulator        |
| `npm run android`   | Start on Android emulator     |
| `npm run typecheck` | TypeScript compilation check  |
| `npm run lint`      | ESLint check                  |
| `npm run format`    | Format code with Prettier     |
| `npm run check`     | Run typecheck + lint + format |

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint:

```
feat: add user profile screen
fix: resolve login crash on Android
docs: update README setup section
refactor: extract theme hook
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `ci`.
