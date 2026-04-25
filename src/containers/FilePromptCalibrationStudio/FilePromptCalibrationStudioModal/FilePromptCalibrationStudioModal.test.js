
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY, UiKeys } from '@/constants/navigation'
import { useQueryParams } from '@/hooks/useQueryParams'
import { Localization, localize } from '@/localization/i18n'
import { uiSelector } from '@/selectors/navigation'
import { render } from '@/utils/rendererRTL'
import { FilePromptCalibrationStudioModal } from './FilePromptCalibrationStudioModal'

const mockSetQueryParams = jest.fn()
const mockManageDocumentType = jest.fn(() => Promise.resolve())

var MockFilePreview

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/navigation')
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/selectors/requests')

jest.mock('@/actions/documentTypes', () => ({
  fetchDocumentTypes: jest.fn(),
}))

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useManageDocumentType: jest.fn(() => ({
    manageDocumentType: mockManageDocumentType,
    isManaging: false,
  })),
}))

jest.mock('@/containers/PromptCalibrationStudio', () => {
  const actual = jest.requireActual('@/containers/PromptCalibrationStudio')

  return {
    ...actual,
    ...mockShallowComponent('PromptCalibrationStudio'),
  }
})

jest.mock('@/containers/FilePreview', () => {
  const mock = mockShallowComponent('FilePreview')
  MockFilePreview = mock.FilePreview
  return mock
})

jest.mock('@/hooks/useQueryParams', () => ({
  useQueryParams: jest.fn(() => ({
    queryParams: {},
    setQueryParams: mockSetQueryParams,
  })),
}))

beforeEach(() => {
  jest.clearAllMocks()

  uiSelector.mockReturnValue({
    [UiKeys.ACTIVE_PAGE]: 1,
  })

  useQueryParams.mockReturnValue({
    queryParams: {},
    setQueryParams: mockSetQueryParams,
  })
})

test('renders nothing when query param is not set', () => {
  render(<FilePromptCalibrationStudioModal />)

  expect(screen.queryByTestId('PromptCalibrationStudio')).not.toBeInTheDocument()
})

test('renders modal when query param is set', () => {
  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudioModal />)

  expect(screen.getByTestId('PromptCalibrationStudio')).toBeInTheDocument()
  expect(screen.getByTestId('FilePreview')).toBeInTheDocument()
})

test('renders correct layout with correct props when modal is visible', () => {
  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudioModal />)

  expect(MockFilePreview).toHaveBeenCalledWith(
    expect.objectContaining({
      activePage: 1,
    }),
    expect.anything(),
  )
})

test('closes modal when close button is clicked', async () => {
  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudioModal />)

  const closeButton = screen.getByText(localize(Localization.CLOSE_STUDIO))
  await userEvent.click(closeButton)

  expect(mockSetQueryParams).toHaveBeenCalledWith({
    [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: undefined,
  })
})

test('renders CommitDocumentTypeModal with disabled state when no fields', () => {
  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  render(<FilePromptCalibrationStudioModal />)

  const commitButton = screen.getByRole('button', { name: localize(Localization.SAVE_TO_DOCUMENT_TYPE) })

  expect(commitButton).toBeDisabled()
})

test('disables CommitDocumentTypeModal when calibrationValues.fields.length is 0', () => {
  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  const mockCalibrationValues = {
    fields: [],
    extractors: [],
  }

  jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [false, jest.fn()])
    .mockImplementationOnce(() => [mockCalibrationValues, jest.fn()])
    .mockImplementationOnce(() => [true, jest.fn()])

  render(<FilePromptCalibrationStudioModal />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE_TO_DOCUMENT_TYPE),
  })

  expect(saveButton).toBeDisabled()
})

test('disables CommitDocumentTypeModal when calibrationValues.calibrationMode is provided', () => {
  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  const mockCalibrationValues = {
    fields: [{
      id: 'field-1',
      name: 'Test Field',
    }],
    extractors: [],
    calibrationMode: 'test-mode',
  }

  jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [false, jest.fn()])
    .mockImplementationOnce(() => [mockCalibrationValues, jest.fn()])
    .mockImplementationOnce(() => [true, jest.fn()])

  render(<FilePromptCalibrationStudioModal />)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE_TO_DOCUMENT_TYPE),
  })

  expect(saveButton).toBeDisabled()
})

test('does not render FilePreview when isModalRendered is false', () => {
  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [false, jest.fn()])
    .mockImplementationOnce(() => [null, jest.fn()])
    .mockImplementationOnce(() => [false, jest.fn()])

  render(<FilePromptCalibrationStudioModal />)

  expect(MockFilePreview).not.toHaveBeenCalled()
})

test('renders FilePreview when isModalRendered is true', () => {
  useQueryParams.mockReturnValue({
    queryParams: { [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1 },
    setQueryParams: mockSetQueryParams,
  })

  jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [false, jest.fn()])
    .mockImplementationOnce(() => [null, jest.fn()])
    .mockImplementationOnce(() => [true, jest.fn()])

  render(<FilePromptCalibrationStudioModal />)

  expect(MockFilePreview).toHaveBeenCalled()
})
