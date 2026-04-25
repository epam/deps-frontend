---
name: unit-tests
description: Write unit tests for React components in this codebase using React Testing Library. Use this skill whenever asked to write tests, add test coverage, create .test.js files, or migrate existing Enzyme tests to RTL. Always consult this skill before writing any test code.
---

## File naming and location

- Test files use `.test.js` extension, co-located with the source file.
- Name matches source: `ComponentName.test.js` for `ComponentName.jsx`.

## Import order

1. Mock utilities from `@/mocks/*`
2. Testing library and external imports alphabetically (`@testing-library/*`, etc.)
3. Internal imports alphabetically (`@/*`) — include `{ Localization, localize }` when testing localized text
4. Local relative imports

```javascript
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { mockUuid } from '@/mocks/mockUuid'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import flushPromises from 'flush-promises'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ComponentName } from './ComponentName'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('uuid', () => mockUuid)
```

## Structure rules

- Use `test()` not `it()`. No `describe()` blocks.
- Use `beforeEach` for setup; always call `jest.clearAllMocks()`.
- Do not use `act()` directly.
- Do not use `toMatchSnapshot()` for layout.
- Do not mock models, localization, or enums.
- No comments in test code.

```javascript
beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = { ... }
})

test('renders error message when API call fails', () => {
  ...
})
```

## Rendering

- `render` from `@/utils/rendererRTL` for unit tests.
- `@testing-library/react` for integration tests.

## Assertions

- Use `toHaveBeenNthCalledWith(n, ...args)` — never access `mock.calls[0][0]` or `mock.lastCall`.
- Use `expect.any(Function)` for type-only checks.
- Prefer `toEqual()` for complete object verification.

## Localization

Always use `localize(Localization.KEY)` — never hardcode user-visible strings.

```javascript
// WRONG
expect(button).toHaveTextContent('Submit')

// CORRECT
expect(button).toHaveTextContent(localize(Localization.SUBMIT))
```

## Mock utilities

| Utility | Usage |
|---|---|
| `mockEnv` | Always mock `@/utils/env` — required in every test file |
| `mockReactRedux` | `jest.mock('react-redux', () => mockReactRedux)` |
| `mockReactRouter` | `jest.mock('react-router-dom', ...)` or `withRouter` HOC |
| `mockReactHookForm` | `jest.mock('react-hook-form', () => mockReactHookForm)` |
| `mockShallowComponent(name)` | Renders `<template data-testid={name}>` — use when you need `getByTestId` |
| `mockComponent(name)` | Renders plain text — use when no DOM query needed |
| `mockUuid` | Sequential IDs ('1', '2', ...) for deterministic tests |
| `mockNotification` | AntD notifications |

### mockShallowComponent gotchas

- `mockShallowComponent(name, true, false)` returns the jest fn directly (not a named export). Use default `mockShallowComponent(name)` for named export.
- When the mocked component receives React elements or Window as props, `mockShallowComponent` will fail (`JSON.stringify` error). Use a plain component instead:
  ```javascript
  jest.mock('@/components/Sidebar', () => ({
    Sidebar: ({ className }) => <div className={className} data-testid="Sidebar" />,
  }))
  ```

### jest.mock() TDZ issue

Never assign inside `jest.mock()` factory:
```javascript
// WRONG — TDZ error
let MockFoo
jest.mock('...', () => { MockFoo = ...; return ... })

// CORRECT
jest.mock('...', () => mockShallowComponent('Foo'))
const { Foo: MockFoo } = jest.requireMock('...')
```

## AntD-specific patterns

### Modal visibility
AntD Modal keeps the DOM when closed (no `destroyOnClose`). Use `queryByRole('dialog')` — it respects `aria-hidden` set by AntD.
Do NOT use `not.toBeInTheDocument()` on modal content text.

### Dropdown portal
Mock `@/components/Dropdown` to render `dropdownRender()` inline:
```javascript
jest.mock('@/components/Dropdown', () => ({
  Dropdown: ({ children, dropdownRender }) => (
    <div>{children}{dropdownRender && dropdownRender()}</div>
  ),
}))
```

### Spin double render
AntD Spin renders `data-testid` on two elements. Mock `@/components/Spin`:
```javascript
jest.mock('@/components/Spin', () => ({
  Spin: ({ children }) => <div data-testid="spin">{children}</div>,
}))
```

### Modal.confirm
Mutate directly in the test (both test and component share the same module reference):
```javascript
Modal.confirm = jest.fn()
```

### AntD Menu / StyledMenu in JSDOM
Causes unknown-prop React warnings that throw. Mock `./CustomMenu.styles` with plain HTML elements.

## FEATURES global

`FeatureControl` accesses the `FEATURES` webpack global — not defined in JSDOM.
```javascript
jest.mock('@/components/FeatureControl', () => ({ FeatureControl: () => null }))
```

## Lazy / Suspense components

Mock `@/utils/lazy` to return synchronous components and avoid Suspense hanging:
```javascript
jest.mock('@/utils/lazy', () => ({
  lazy: (_fn, name) => () => <div data-testid={name} />,
}))
```

## React Router without provider

When component uses `Switch`/`Redirect` and `rendererRTL` doesn't wrap with a Router:
```javascript
jest.mock('react-router-dom', () => ({
  Switch: ({ children }) => <div>{children}</div>,
  Redirect: () => <div data-testid="redirect" />,
}))
```

## mockReactRedux patterns

`connect(mapStateToProps, mapDispatchToProps)` returns `{ mapStateToProps, mapDispatchToProps, ConnectedComponent }`.
- `mapStateToProps(state)` returns `{ props: {...} }`
- `mapDispatchToProps()` returns `{ props: {...}, dispatch: jest.fn() }`
- Object-style `mapDispatchToProps` is auto-converted.

For `useSelector` / `useDispatch`: `mockReactRedux.useSelector = jest.fn((selector) => selector())`.

When testing a connected component with object-style `mapDispatchToProps` (e.g. `connect(mapState, { setSelection })`), pass `defaultProps.setSelection = jest.fn()` and assert on `defaultProps.setSelection`, NOT on the imported action creator module.

## Selector __mocks__ files

`jest.mock('@/selectors/authorization')` loads `src/selectors/__mocks__/authorization.js`.
Get the mock value: `userSelector.getSelectorMockValue()`.

## Test naming

Follow the pattern: `renders [expected behavior] when [condition]` or `does [action] when [condition]`.

```javascript
// GOOD
test('renders secondary button with icon and drawer is not visible initially')
test('submits form and creates Field instance with correct values')
test('does not call add function when cancel button is clicked')

// BAD
test('works')
test('renders correctly')
test('button test')
```

## What to test

- User-facing behavior: what the user sees and interacts with
- Props: component renders correctly with different prop combinations
- User interactions: clicks, typing, form submissions
- Conditional rendering: loading, error, empty, success states
- Integration: API calls, Redux actions
- Error handling: validation errors, API failures, edge cases

## What NOT to test

- Implementation details (internal state, private methods)
- Third-party libraries
- CSS classes or inline styles (unless critical for behavior)
- Exact DOM structure
- Trivial pass-through props
- Mock internals (`mock.calls[0][0]`)

## Anti-patterns

```javascript
// WRONG — brittle, hard to read
const arg = mockFn.mock.calls[0][0]

// CORRECT
expect(mockFn).toHaveBeenNthCalledWith(1, expectedArg)
```

```javascript
// WRONG — tests implementation, breaks on refactor
expect(wrapper.state('count')).toBe(0)

// CORRECT
expect(screen.getByText('Count: 0')).toBeInTheDocument()
```

```javascript
// WRONG — breaks when translations change
expect(button).toHaveTextContent('Submit')

// CORRECT
expect(button).toHaveTextContent(localize(Localization.SUBMIT))
```

```javascript
// WRONG — non-deterministic
expect(obj.id).toBeDefined()

// CORRECT — mock uuid for predictable IDs
jest.mock('uuid', () => mockUuid)
expect(obj.id).toBe('1')
```

## Running tests

```bash
# Specific file
node --trace-warnings --unhandled-rejections=strict ./node_modules/jest/bin/jest.js \
  --colors --expand --errorOnDeprecated --config ./config/jest.config.js {fileName}

# Watch mode
yarn test:manual

# All tests with coverage
yarn test:auto
```
