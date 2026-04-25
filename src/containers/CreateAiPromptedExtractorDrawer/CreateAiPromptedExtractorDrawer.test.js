
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createDocumentType } from '@/api/documentTypesApi'
import { ExtractionType } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { notifySuccess, notifyError } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { goTo } from '@/utils/routerActions'
import { CreateAiPromptedExtractorDrawer } from './CreateAiPromptedExtractorDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/api/documentTypesApi', () => ({
  createDocumentType: jest.fn(),
}))

jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

const OPEN_DRAWER_BUTTON = 'Open Drawer'

test('shows drawer on trigger click', async () => {
  render(
    <CreateAiPromptedExtractorDrawer>
      {OPEN_DRAWER_BUTTON}
    </CreateAiPromptedExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))

  expect(screen.getByText(localize(Localization.ADD_AI_PROMPTED))).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))).toBeInTheDocument()
})

test('should call createDocumentType on submit button click', async () => {
  render(
    <CreateAiPromptedExtractorDrawer>
      {OPEN_DRAWER_BUTTON}
    </CreateAiPromptedExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))

  const input = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  await userEvent.type(input, 'Test Document Type')

  const createButton = screen.getByRole('button', { name: localize(Localization.CREATE) })
  await userEvent.click(createButton)

  expect(createDocumentType).nthCalledWith(1, {
    name: 'Test Document Type',
    extractorType: ExtractionType.AI_PROMPTED,
  })
})

test('should call success notification on successful document type creation', async () => {
  createDocumentType.mockResolvedValueOnce({ documentTypeId: 1 })

  render(
    <CreateAiPromptedExtractorDrawer>
      {OPEN_DRAWER_BUTTON}
    </CreateAiPromptedExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))

  const input = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  await userEvent.type(input, 'Test Document Type')

  const createButton = screen.getByRole('button', { name: localize(Localization.CREATE) })
  await userEvent.click(createButton)

  expect(notifySuccess).nthCalledWith(1, localize(Localization.AI_PROMPTED_CREATION_SUCCESS_MESSAGE))
})

test('should call goTo with correct args on successful document type creation', async () => {
  createDocumentType.mockResolvedValueOnce({ documentTypeId: 1 })

  render(
    <CreateAiPromptedExtractorDrawer>
      {OPEN_DRAWER_BUTTON}
    </CreateAiPromptedExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))

  const input = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  await userEvent.type(input, 'Test Document Type')

  const createButton = screen.getByRole('button', { name: localize(Localization.CREATE) })
  await userEvent.click(createButton)

  const expectedUrl = navigationMap.documentTypes.documentType(1)

  expect(goTo).nthCalledWith(1, expectedUrl)
})

test('should display error notification if createDocumentType fails', async () => {
  createDocumentType.mockRejectedValueOnce(new Error('Creation failed'))

  render(
    <CreateAiPromptedExtractorDrawer>
      {OPEN_DRAWER_BUTTON}
    </CreateAiPromptedExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))

  const input = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  await userEvent.type(input, 'Test Document Type')

  const createButton = screen.getByRole('button', { name: localize(Localization.CREATE) })
  await userEvent.click(createButton)

  expect(notifyError).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR_MESSAGE))
})

test('should disable the Create button when form is invalid', async () => {
  render(
    <CreateAiPromptedExtractorDrawer>
      {OPEN_DRAWER_BUTTON}
    </CreateAiPromptedExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))

  const createButton = screen.getByRole('button', { name: localize(Localization.CREATE) })
  expect(createButton).toBeDisabled()

  const input = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  await userEvent.type(input, 'Valid Name')

  expect(createButton).toBeEnabled()
})

test('create ai-prompted extractor if form is submitted with Enter key', async () => {
  const mockName = 'Test Document Type'
  createDocumentType.mockResolvedValueOnce({ documentTypeId: 1 })

  render(
    <CreateAiPromptedExtractorDrawer>
      {OPEN_DRAWER_BUTTON}
    </CreateAiPromptedExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))

  const input = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  await userEvent.type(input, mockName)

  await userEvent.keyboard('{Enter}')

  expect(createDocumentType).nthCalledWith(1, {
    name: mockName,
    extractorType: ExtractionType.AI_PROMPTED,
  })

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.AI_PROMPTED_CREATION_SUCCESS_MESSAGE),
  )

  const expectedUrl = navigationMap.documentTypes.documentType(1)
  expect(goTo).nthCalledWith(1, expectedUrl)
})
