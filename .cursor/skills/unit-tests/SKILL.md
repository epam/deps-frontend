---
name: unit-tests
description: Rules for writing unit tests
---
# Cursor Rules for Unit Tests

## Test File Structure and Naming

- Create test files with `.test.js` extension alongside the source files
- Test files should be co-located with the source files they test
- Use descriptive test file names that match the source file name: `ComponentName.test.js` for `ComponentName.jsx`
- For containers, use `ContainerName.test.js` for `ContainerName.jsx`

### Code Quality
- Do NOT add comments in the code of the test
- Write self-documenting test code with clear variable names and descriptive test names
- Use descriptive variable names that explain the purpose of the data
- Do NOT use `require`, use import at the top of the test file
- Always use localization strings (`localize(Localization.KEY)`) instead of hardcoded strings when testing text content that uses localization in the component
- Focus on testing behavior, not implementation details
- Write tests that are maintainable and won't break with minor refactorings
- Keep tests simple and focused on a single concern

## Test Organization and Structure

### Import Organization
Follow this import order:
1. Mock imports (from `@/mocks/*`) - including `mockUuid` when testing components that generate IDs
2. Testing library imports and external library import alphabetically (`@testing-library/*`, `enzyme`, `jest`)
3. Internal imports alphabetically (from `@/*`) - including `{ Localization, localize } from '@/localization/i18n'` when testing localized text
4. Local imports (relative paths)

**Example with all common imports:**
```javascript
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { mockUuid } from '@/mocks/mockUuid'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ComponentName } from './ComponentName'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('uuid', () => mockUuid)
```

### Test Structure
```javascript
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import flushPromises from 'flush-promises'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
// ... other imports

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    // ... props
  }
})

test('renders correctly when {if case}', () => {
  // test implementation
})
```

## Testing Patterns

### Component Testing
- Use `render` from '@/utils/rendererRTL' for component unit tests
- Use `@testing-library/react` for integration tests
- Test component rendering, props, state changes, and user interactions
- Avoid `toMatchSnapshot()` for layout testing
- Test both success and error scenarios
- Do not use `describe` block
- Use `test` block instead of `it`
- Do not use `act`
- Do not mock models, localisation and any enums
- Update snapshots in case it's needed and snapshots are valid based on new changes in the code

### Container Testing

#### Container Structure Testing
- Test both connected and disconnected components when applicable
- Test `mapStateToProps` and `mapDispatchToProps` separately
- Use `render` from `@/utils/rendererRTL` for integration testing

#### Container-Specific Testing Guidelines
- Test Redux state mapping and action dispatching
- Test component side effects
- Test conditional rendering based on props/state
- Test error boundaries and loading states
- Test user interactions that trigger Redux actions

### Utility Function Testing
- Test all exported functions
- Test edge cases and error conditions
- Mock external dependencies (APIs, file system, etc.)
- Use descriptive test names that explain the expected behavior

### Action/Reducer Testing
- Test action creators return correct action objects
- Test reducers handle all action types
- Test state immutability

### API Testing
- Mock API calls using `jest.mock()`
- Test both success and error responses
- Test loading states
- Use `flush-promises` for async operations if needed

## Mocking Guidelines

### Mock Structure
```javascript
const mockFunction = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve(mockData))
}))

jest.mock('@/api/someApi', () => ({
  someApiFunction: mockFunction
}))
```

### Common Mocks
- Always mock `@/utils/env` with `mockEnv`
- Mock React Redux with `mockReactRedux` for action testing
- Mock notifications with `mockNotification`
- Mock React Router hooks for component testing
- You can use `mockShallowComponent` and its `getProps`
- Mock UUIDs with `mockUuid` from `@/mocks/mockUuid` for predictable IDs in tests

#### UUID Mocking
When testing components that generate IDs using `uuid`, mock it for predictable test results:

```javascript
import { mockUuid } from '@/mocks/mockUuid'

jest.mock('uuid', () => mockUuid)

test('creates object with predictable ID', () => {
  // First call returns '1', second returns '2', etc.
  const result = createObject()
  expect(result.id).toBe('1')
})
```

**Note:** `mockUuid` generates sequential IDs ('1', '2', '3', etc.) across all tests in a file. Account for this when writing assertions.

### Container-Specific Mocks
```javascript
// Mock selectors
jest.mock('@/selectors/someSelector', () => ({
  someSelector: jest.fn(() => mockData)
}))

// Mock actions
jest.mock('@/actions/someAction', () => ({
  someAction: jest.fn(() => ({ type: 'SOME_ACTION' }))
}))

// Mock external components
jest.mock('@/components/SomeComponent', () => ({
  SomeComponent: jest.fn(() => <div>Mocked Component</div>)
}))

var MockTableLayout

jest.mock('./ParagraphLayout', () => mockShallowComponent('ParagraphLayout'))
jest.mock('./TableLayout', () => {
  const mock = mockShallowComponent('TableLayout')
  MockTableLayout = mock.TableLayout
  return mock
})
```

## Testing Best Practices

### Test Naming
- Use descriptive test names that explain the scenario and expected behavior
- Follow the pattern: "renders [expected behavior] when [condition]" or "does [action] when [condition]"
- Be specific about what is being tested
- Avoid generic names like "works correctly" or "renders properly"
- Example: `test('displays error message when API call fails')`
- Example: `test('disables submit button when form is invalid')`
- Example: `test('calls add function when form is submitted')`
- For containers: `test('dispatches action when user clicks button')`

**Good test names:**
```javascript
test('renders secondary button with icon and drawer is not visible initially')
test('submits form and creates Field instance with correct values')
test('does not call add function when cancel button is clicked')
test('closes drawer after successful form submission')
```

**Bad test names:**
```javascript
test('works')
test('renders correctly')
test('button test')
test('form submission')
```

### Assertions
- Use specific assertions: `toBe()`, `toEqual()`, `toContain()`
- Use `expect.any()` for type checking of Functions
- Prefer `toEqual()` for complete object verification over partial matches
- For containers: test Redux state changes and action dispatches

#### Mock Function Verification
- **NEVER** access mock internals like `mock.calls[0][0]` or `mock.lastCall[0]`
- Use Jest's assertion methods for verifying mock calls
- Use `toHaveBeenNthCalledWith(n, ...args)` to verify exact arguments passed to mocks
- Mock UUIDs for predictable IDs in tests using `mockUuid` from `@/mocks/mockUuid`

**Example - INCORRECT (accessing mock internals):**
```javascript
const fieldInstance = defaultProps.add.mock.calls[0][0]
expect(fieldInstance.name).toBe('Test Field')
expect(fieldInstance.id).toBeDefined()
```

**Example - CORRECT (using toHaveBeenNthCalledWith with mocked UUID):**
```javascript
import { mockUuid } from '@/mocks/mockUuid'

jest.mock('uuid', () => mockUuid)

test('submits form with correct values', async () => {
  await user.click(submitButton)
  
  expect(defaultProps.add).toHaveBeenCalledTimes(1)
  expect(defaultProps.add).toHaveBeenNthCalledWith(1, {
    id: '1',
    name: 'Test Field',
    fieldType: 'string',
    extractorId: 'test-extractor-id',
    value: '',
  })
})
```

**Example - For behavior-only testing (when exact arguments don't matter):**
```javascript
test('calls add function when form is submitted', async () => {
  await user.click(submitButton)
  
  expect(defaultProps.add).toHaveBeenCalledTimes(1)
})
```

### Async Testing
- Use `async/await` for async operations
- Use `flush-promises` when needed
- Test both resolved and rejected promises
- Use `waitFor()` from React Testing Library for async UI updates
- Use `screen` from '@testing-library/react'

### User Interaction Testing
- Use `userEvent` from `@testing-library/user-event`
- Test user interactions like clicks, typing, form submissions
- Verify UI updates after interactions
- For containers: verify that interactions trigger correct Redux actions

### Localization Testing
- **Always use `localize(Localization.KEY)` instead of hardcoded strings** when testing text that uses localization in the component
- Import `{ Localization, localize }` from `@/localization/i18n` in test files
- This ensures tests remain valid if translations change
- Do NOT mock localization - use actual localization functions

**Example - INCORRECT:**
```javascript
test('renders button with label', () => {
  render(<MyButton />)
  expect(screen.getByRole('button')).toHaveTextContent('Submit')
})
```

**Example - CORRECT:**
```javascript
import { Localization, localize } from '@/localization/i18n'

test('renders button with label', () => {
  render(<MyButton />)
  expect(screen.getByRole('button')).toHaveTextContent(localize(Localization.SUBMIT))
})
```

**Example - Finding elements with localized text:**
```javascript
// Find button by localized text
const submitButton = buttons.find((btn) => btn.textContent === localize(Localization.SUBMIT))

// Assert text content
expect(element).toHaveTextContent(localize(Localization.ADD_FIELD))
```

### Error Testing
- Test error boundaries
- Test API error responses
- Test validation errors
- Test edge cases and boundary conditions

### Container Error Testing
- Test error states in Redux selectors
- Test error handling in async actions
- Test error boundaries for container components
- Test loading states and error recovery

## ESLint Rules for Tests

Tests automatically inherit these rules from the project configuration:
- `testing-library/await-async-query`: "error"
- `testing-library/no-await-sync-query`: "error"
- `testing-library/no-debugging-utils`: "warn"
- `testing-library/no-node-access`: "warn"
- `react/prop-types`: "off" (in test files)

## Running Tests

### Yarn Commands
- `yarn test:manual` - Run tests in watch mode
- `yarn test:auto` - Run all tests with coverage
- `yarn test:ci` - Run tests in CI environment
- `yarn test:debug` - Run tests with debugger support

### Running Particular Test Files
To run a specific test file, use the following command:

```bash
cd /Users/Dzmitry_Astraukh/Documents/Repos/deps-frontend && node --trace-warnings --unhandled-rejections=strict ./node_modules/jest/bin/jest.js --colors --expand --errorOnDeprecated --config ./config/jest.config.js {fileName}
```

Replace `{fileName}` with the test filename or file path. You can use either:
- Just the filename: `ComponentName.test.js`
- Full path: `src/containers/ComponentName/ComponentName.test.js`

**Examples:**
```bash
cd /Users/Dzmitry_Astraukh/Documents/Repos/deps-frontend && node --trace-warnings --unhandled-rejections=strict ./node_modules/jest/bin/jest.js --colors --expand --errorOnDeprecated --config ./config/jest.config.js KeyValuePairInsightsComparison.test.js
```

```bash
cd /Users/Dzmitry_Astraukh/Documents/Repos/deps-frontend && node --trace-warnings --unhandled-rejections=strict ./node_modules/jest/bin/jest.js --colors --expand --errorOnDeprecated --config ./config/jest.config.js src/containers/PromptCalibrationStudio/AddFieldDrawer/AddFieldDrawer.test.js
```

**Note:** The command includes `cd` to the project directory to ensure tests run with correct context. When running from terminal, use `required_permissions: ["all"]` to avoid sandbox restrictions.

## Common Test Utilities

### Mock Data
- Use factory functions for creating mock objects
- Keep mock data realistic and consistent
- Use enums for status values and constants
- Use model to create mock data in the unit tests

### Container Mock Data
```javascript
// Use models for creating mock data
const mockDocument = new Document({
  id: 'mock-id',
  name: 'Mock Document',
  status: DocumentStatus.PROCESSING
})

// Use selectors for mock data
const mockSelectorData = {
  documents: [mockDocument],
  loading: false,
  error: null
}
```

### Test Setup
- Use `beforeEach` for common setup
- Clear mocks between tests with `jest.clearAllMocks()` if needed

### Container Test Setup
```javascript
beforeEach(() => {
  jest.clearAllMocks()
  
  // Setup default props
  defaultProps = {
    // container props
  }
  
  // Setup mock selectors
  someSelector.mockReturnValue(mockSelectorData)
  
  // Setup mock actions
  mockDispatch.mockClear()
})
```

## Performance Considerations

- Keep tests focused and fast
- Mock heavy operations (API calls, file I/O)
- Avoid testing implementation details, focus on behavior
- For containers: mock expensive selectors and API calls

## Common Anti-Patterns to Avoid

### ❌ Accessing Mock Internals
```javascript
const result = mockFunction.mock.calls[0][0]
const result = mockFunction.mock.lastCall[0]
```
**Why:** Brittle, couples tests to implementation, hard to read.

**✅ Do this instead:**
```javascript
expect(mockFunction).toHaveBeenNthCalledWith(1, expectedArg)
expect(mockFunction).toHaveBeenCalledTimes(1)
```

### ❌ Testing Implementation Details
```javascript
test('component has correct state', () => {
  const wrapper = shallow(<Component />)
  expect(wrapper.state('count')).toBe(0)
})
```
**Why:** Tests break when refactoring, doesn't test user-facing behavior.

**✅ Do this instead:**
```javascript
test('displays initial count of 0', () => {
  render(<Component />)
  expect(screen.getByText('Count: 0')).toBeInTheDocument()
})
```

### ❌ Hardcoding Localized Strings
```javascript
expect(button).toHaveTextContent('Submit')
```
**Why:** Tests break when translations change.

**✅ Do this instead:**
```javascript
expect(button).toHaveTextContent(localize(Localization.SUBMIT))
```

### ❌ Non-Deterministic Tests
```javascript
test('creates object with ID', () => {
  const obj = createObject()
  expect(obj.id).toBeDefined()
})
```
**Why:** Doesn't verify exact value, can hide bugs.

**✅ Do this instead:**
```javascript
jest.mock('uuid', () => mockUuid)

test('creates object with ID', () => {
  const obj = createObject()
  expect(obj.id).toBe('1')
})
```

### ❌ Over-Mocking
```javascript
jest.mock('./utils')
jest.mock('./helpers')
jest.mock('./components/Button')
jest.mock('./components/Input')
```
**Why:** Tests don't catch integration issues, mock maintenance overhead.

**✅ Do this instead:**
Mock only external dependencies (APIs, third-party libraries). Let your own code run.

### ❌ Testing Multiple Things in One Test
```javascript
test('form works', async () => {
  render(<Form />)
  expect(input).toBeInTheDocument()
  await user.type(input, 'test')
  expect(input).toHaveValue('test')
  await user.click(submitButton)
  expect(onSubmit).toHaveBeenCalled()
  expect(successMessage).toBeInTheDocument()
})
```
**Why:** Hard to debug when it fails, unclear what's being tested.

**✅ Do this instead:**
Split into focused tests: rendering, typing, submission, success message.

## Debugging Tests

- Use `console.log` sparingly in tests to get logs
- Run single test file for faster debugging: `yarn test:manual path/to/test.js`
- Use `test.only()` to run a single test (remove before committing)
- Check test output carefully - Jest shows helpful diffs for failed assertions

## Container-Specific Considerations

### Testing Redux Integration
- Test that containers correctly map state to props
- Test that user interactions dispatch correct actions
- Test that async actions handle loading, success, and error states
- Test that selectors return expected data

### Testing Conditional Rendering
- Test different prop combinations
- Test loading states
- Test error states
- Test empty states

### Testing User Interactions
- Test that clicks trigger correct actions
- Test that form submissions work correctly
- Test that navigation works as expected
- Test that error handling works properly

### Testing Async Operations
- Test that loading states are shown
- Test that success states are handled
- Test that error states are handled
- Test that retry mechanisms work

### Testing Edge Cases
- Test with empty data
- Test with null/undefined values
- Test with maximum/minimum values
- Test boundary conditions
- Test error states and recovery

## Test Coverage Guidelines

### What to Test (Essential)
- **User-facing behavior**: What the user sees and interacts with
- **Props validation**: Component renders correctly with different props
- **User interactions**: Clicks, typing, form submissions, navigation
- **Conditional rendering**: Different states (loading, error, empty, success)
- **Integration points**: API calls, Redux actions, routing
- **Error handling**: Error states, validation errors, API failures
- **Critical business logic**: Calculations, validations, transformations

### What NOT to Test (Avoid)
- **Implementation details**: Internal state, private methods, variable names
- **Third-party libraries**: Don't test React, Redux, or other libraries
- **Styling details**: CSS classes, inline styles (unless critical for functionality)
- **Exact DOM structure**: Unless it affects functionality
- **Trivial code**: Simple getters/setters, pass-through props
- **Mock internals**: Don't verify mock.calls directly

### Writing Essential Tests Only
Focus on tests that:
1. **Verify critical functionality** - Tests that catch real bugs
2. **Document behavior** - Tests that explain how the component should work
3. **Prevent regressions** - Tests that catch breaking changes
4. **Add value** - Tests that are worth maintaining

**Example - Essential test:**
```javascript
test('submits form when all required fields are filled', async () => {
  render(<AddFieldDrawer {...defaultProps} />)
  
  await user.click(openButton)
  await user.type(nameInput, 'Field Name')
  await user.click(submitButton)
  
  expect(defaultProps.add).toHaveBeenCalledTimes(1)
})
```

**Example - Non-essential test (avoid):**
```javascript
test('has correct className on wrapper div', () => {
  const { container } = render(<Component />)
  expect(container.firstChild).toHaveClass('wrapper')
})
```


### Test Maintenance
- Remove tests that break frequently without catching real bugs
- Update tests when behavior changes, don't just fix them to pass
- Refactor tests that are hard to understand or maintain
- Delete redundant tests that verify the same behavior

