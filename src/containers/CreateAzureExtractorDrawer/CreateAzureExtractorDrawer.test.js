
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { goTo } from '@/utils/routerActions'
import { CreateAzureExtractorDrawer } from './CreateAzureExtractorDrawer'

const mockCreateAzureExtractor = jest.fn(() => ({
  unwrap: jest.fn(() => ({ extractorId: mockId })),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useCreateAzureExtractorMutation: jest.fn(() => ([
    mockCreateAzureExtractor,
    { isLoading: false },
  ])),
}))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/containers/AzureExtractorDrawer', () => ({
  AzureExtractorDrawer: ({ onSave }) => (
    <div data-testid='drawer'>
      <button
        data-testid='submit-btn'
        onClick={() => onSave(mockFormValues)}
      />
    </div>
  ),
}))

const mockId = 'testId'
const mockFormValues = {
  name: 'Extractor Name',
  modelId: 'testModelId',
  apiKey: 'testApiKey',
  endpoint: 'url@test.com',
}

test('shows Azure Extractor drawer', async () => {
  render(
    <CreateAzureExtractorDrawer />,
  )

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})

test('should call createAzureExtractor api on submit button click in case of extractor creation', async () => {
  render(
    <CreateAzureExtractorDrawer />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(mockCreateAzureExtractor).nthCalledWith(1, mockFormValues)
})

test('should call success notification on successful extractor creation', async () => {
  render(
    <CreateAzureExtractorDrawer />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifySuccess).nthCalledWith(1, localize(Localization.AZURE_CLOUD_NATIVE_EXTRACTOR_SUCCESS_CREATION))
})

test('should call goTo with correct args on successful extractor creation', async () => {
  render(
    <CreateAzureExtractorDrawer />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  const expectedUrl = navigationMap.documentTypes.documentType(mockId)

  expect(goTo).nthCalledWith(1, expectedUrl)
})

test('should display error notification if createAzureExtractor fails with known error', async () => {
  const errorCode = ErrorCode.azureExtractorInvalidCredentials
  const mockError = {
    data: {
      code: errorCode,
    },
  }
  mockCreateAzureExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <CreateAzureExtractorDrawer />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[errorCode],
  )
})

test('should display error notification if createAzureExtractor fails with unknown error', async () => {
  jest.clearAllMocks()

  mockCreateAzureExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error('Creation failed'))),
  }))

  render(
    <CreateAzureExtractorDrawer />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR_MESSAGE),
  )
})
