# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@.claude/rules/general.md
@.claude/rules/honesty.md
@.claude/rules/coding.md
@.claude/skills/unit-tests/SKILL.md

## Commands

```bash
# Development
yarn start           # Webpack dev server (localhost:8081)
yarn build           # Production build

# Testing
yarn test:manual     # Jest watch mode (edited files only)
yarn test:auto       # Full coverage, single run
yarn test:ci         # CI mode (bail on first failure, max workers=1)

# Run specific test file(s)
node --trace-warnings --unhandled-rejections=strict ./node_modules/jest/bin/jest.js \
  --colors --expand --errorOnDeprecated --config ./config/jest.config.js {files...}

# Linting
yarn lint            # eslint + stylelint
yarn lint:fix        # auto-fix both
yarn typecheck       # TypeScript compilation check

# Scaffolding
yarn do:component    # Generate component scaffold
yarn do:container    # Generate container scaffold
```

Use `yarn` only (not npm).

## Architecture

React 17 SPA with Redux state management, AntD 4 UI library, and styled-components. Use styled-components for component UI; co-locate styles in `ComponentName.styles.ts` / `.js` (see `.claude/rules/coding.md`). The app integrates with 20+ backend microservices via environment variables.

**Module Federation** is enabled — the app is structured as a micro-frontend host.

Build and test config lives in `config/` (webpack, jest, babel).

### src/ structure

- `actions/` — Redux action creators (redux-actions)
- `api/` — Traditional fetch/axios HTTP calls
- `apiRTK/` — RTK Query endpoint definitions
- `application/` — Root app component, routing, auth setup
- `components/` — Reusable presentational components (~80 folders)
- `containers/` — Redux-connected components (~240 folders)
- `pages/` — Top-level page containers (~29 folders)
- `reducers/` — Redux reducers using `handleActions`
- `selectors/` — Reselect memoized selectors
- `models/` — ES6 class-based data models with static methods
- `enums/` — TypeScript enums (60+ folders)
- `hooks/` — Custom React hooks
- `hocs/` — Higher-Order Components
- `localization/` — i18next setup + `en-US.js` / `es-ES.js` translation files
- `mocks/` — Mock utilities for tests
- `utils/` — Utility functions including `rendererRTL` and `env`
- `theme/` — styled-components theme

### Component folder convention

```
ComponentName/
├── ComponentName.tsx        # Component (new code: .tsx, legacy: .jsx)
├── ComponentName.styles.ts  # styled-components only
├── ComponentName.test.tsx   # Unit tests
└── index.ts                 # Re-export: export * from './ComponentName'
```

### Redux pattern

- **Actions**: `createAction(${FEATURE_NAME}/ACTION_TYPE)` via redux-actions
- **Reducers**: `handleActions(Map, initialState)` — export named
- **Selectors**: `createSelector` from reselect; base selectors named `featureNameSelector`
- **Containers**: prefer `useSelector`/`useDispatch` hooks over `connect()` for new code; legacy containers use `connect(mapStateToProps, mapDispatchToProps)` — export as `ConnectedComponent`

### API layer

- `src/api/` — traditional calls, organized by domain
- `src/apiRTK/` — RTK Query; prefer this for new endpoints

### Test migration

The codebase is mid-migration from Enzyme to React Testing Library. Many existing test files still use Enzyme patterns. All new tests and migrations must follow the RTL patterns in `.claude/skills/unit-tests.md`.
