
import { mockEnv } from '@/mocks/mockEnv'
import { act, renderHook } from '@testing-library/react-hooks'
import { usePolling } from 'use-raf-polling'
import { fetchDocumentType } from '@/api/documentTypesApi'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { CrossFieldValidator, IssueMessage } from '@/models/CrossFieldValidator'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { Validator } from '@/models/Validator'
import { mockDocumentTypeData } from '../__mocks__/mockDocumentTypeData'
import { useCreateCrossFieldValidators } from './useCreateCrossFieldValidators'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/api/documentTypesApi', () => ({
  fetchDocumentType: jest.fn(() => mockDocumentType),
}))

jest.mock('use-raf-polling', () => ({
  usePolling: jest.fn(({ callback, condition, onPollingSucceed }) => {
    mockPollingCallback = callback
    mockOnPollingSucceed = onPollingSucceed
    condition && onPollingSucceed()
  }),
}))

const mockCreateCrossFieldValidator = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useCreateCrossFieldValidatorMutation: jest.fn(() => ([mockCreateCrossFieldValidator])),
}))

const POLLING_INTERVAL = 3_000
const mockDocumentTypeId = 'Doc Type Id'
let mockOnPollingSucceed
let mockPollingCallback

const [fieldCode1, fieldCode2] = mockDocumentTypeData.genAIFields.map((field) => field.code)
const [createdFieldCode1, createdFieldCode2] = [`created-${fieldCode1}`, `created-${fieldCode2}`]

const fieldsCodesMapping = {
  [fieldCode1]: createdFieldCode1,
  [fieldCode2]: createdFieldCode2,
}

const mockDocumentType = new ExtendedDocumentType({
  code: mockDocumentTypeId,
  validators: [
    new Validator({
      code: createdFieldCode1,
    }),
    new Validator({
      code: createdFieldCode2,
    }),
  ],
})

const crossFieldValidator = new CrossFieldValidator({
  id: 'validator-1',
  name: 'GenAi Fields validator',
  description: 'Test description',
  forAny: false,
  forEach: false,
  rule: `Test rule ${CrossFieldValidator.createRuleField(fieldCode1)} and ${CrossFieldValidator.createRuleField(fieldCode2)}`,
  severity: ValidationRuleSeverity.ERROR,
  validatedFields: [fieldCode1, fieldCode2],
  issueMessage: new IssueMessage({
    dependentFields: [fieldCode1, fieldCode2],
    message: `Test message ${IssueMessage.createMessageField(fieldCode1)} depends on ${IssueMessage.createMessageField(fieldCode2)}`,
  }),
})

const defaultProps = {
  documentTypeDataRef: {
    current: {
      ...mockDocumentTypeData,
      crossFieldValidators: [crossFieldValidator],
      documentTypeId: mockDocumentTypeId,
    },
  },
  fieldsCodesMappingRef: {
    current: fieldsCodesMapping,
  },
  increaseRequestCount: jest.fn(),
}

const renderAndCallHook = async () => {
  const { result } = renderHook(() => useCreateCrossFieldValidators(defaultProps))
  const { createCrossFieldValidators } = result.current
  await act(async () => await createCrossFieldValidators())
}

test('hook returns correct values', () => {
  const { result } = renderHook(() => useCreateCrossFieldValidators(defaultProps))

  expect(result.current).toEqual({
    createCrossFieldValidators: expect.any(Function),
  })
})

test('calls fetchDocumentType with correct arguments on createCrossFieldValidators call', async () => {
  await renderAndCallHook()

  expect(fetchDocumentType).nthCalledWith(
    1,
    mockDocumentTypeId,
    [DocumentTypeExtras.VALIDATORS],
  )
})

test('calls createCrossFieldValidator with correct arguments on Cross Field Validator creation', async () => {
  jest.clearAllMocks()

  await renderAndCallHook()

  const expectedMessage = `Test message ${IssueMessage.createMessageField(createdFieldCode1)} depends on ${IssueMessage.createMessageField(createdFieldCode2)}`
  const expectedRule = `Test rule ${CrossFieldValidator.createRuleField(createdFieldCode1)} and ${CrossFieldValidator.createRuleField(createdFieldCode2)}`

  expect(mockCreateCrossFieldValidator).nthCalledWith(
    1,
    {
      documentTypeId: mockDocumentTypeId,
      data: {
        name: crossFieldValidator.name,
        description: crossFieldValidator.description,
        forAny: crossFieldValidator.forAny,
        forEach: crossFieldValidator.forEach,
        severity: crossFieldValidator.severity,
        dependentFields: [createdFieldCode1, createdFieldCode2],
        issueMessage: expectedMessage,
        validatedFields: [createdFieldCode1, createdFieldCode2],
        rule: expectedRule,
      },
    },
  )
})

test('calls increaseRequestCount on Cross Field Validator creation', async () => {
  jest.clearAllMocks()

  await renderAndCallHook()

  expect(defaultProps.increaseRequestCount).toHaveBeenCalled()
})

test('should start document type polling if document type validators are not created', async () => {
  jest.clearAllMocks()

  fetchDocumentType.mockImplementationOnce(() => ({
    ...mockDocumentType,
    validators: [],
  }))

  await renderAndCallHook()

  expect(usePolling).nthCalledWith(2, {
    callback: expect.any(Function),
    interval: POLLING_INTERVAL,
    condition: true,
    onPollingSucceed: expect.any(Function),
  })
})

test('calls fetchDocumentType with correct arguments on document type polling', async () => {
  jest.clearAllMocks()

  fetchDocumentType.mockImplementationOnce(() => ({
    ...mockDocumentType,
    validators: [],
  }))

  await renderAndCallHook()
  await act(async () => await mockPollingCallback())

  expect(fetchDocumentType).nthCalledWith(
    2,
    mockDocumentTypeId,
    [DocumentTypeExtras.VALIDATORS],
  )
})

test('calls Cross Field Validators creation flow on polling success', async () => {
  jest.clearAllMocks()

  fetchDocumentType.mockImplementationOnce(() => ({
    ...mockDocumentType,
    validators: [],
  }))

  await renderAndCallHook()
  await act(async () => await mockOnPollingSucceed())

  expect(mockCreateCrossFieldValidator).toHaveBeenCalled()
  expect(defaultProps.increaseRequestCount).toHaveBeenCalled()
})
