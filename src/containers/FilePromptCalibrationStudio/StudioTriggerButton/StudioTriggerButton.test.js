
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { clearActivePolygons, setHighlightedField } from '@/actions/fileReviewPage'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { FileStatus } from '@/enums/FileStatus'
import { localize, Localization } from '@/localization/i18n'
import { File, FileState } from '@/models/File'
import { render } from '@/utils/rendererRTL'
import { StudioTriggerButton } from './StudioTriggerButton'

const mockSetQueryParams = jest.fn()

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/actions/fileReviewPage', () => ({
  clearActivePolygons: jest.fn(() => ({ type: 'mockType' })),
  setHighlightedField: jest.fn(() => ({ type: 'mockType' })),
}))
jest.mock('@/hooks/useQueryParams', () => ({
  useQueryParams: jest.fn(() => ({
    setQueryParams: mockSetQueryParams,
  })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileQuery: jest.fn(() => ({
    data: mockFile,
  })),
}))

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    fileId,
  })),
}))

const fileId = 'test-file-id'

const mockFile = new File({
  id: fileId,
  tenantId: 'test-tenant-id',
  name: 'test-file.pdf',
  path: 'path/test-file.pdf',
  state: new FileState({
    status: FileStatus.COMPLETED,
  }),
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders button', () => {
  render(<StudioTriggerButton />)

  const button = screen.getByRole('button', {
    name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
  })

  expect(button).toBeInTheDocument()
})

test('calls setQueryParams with correct arguments when button is clicked', async () => {
  render(<StudioTriggerButton />)

  const button = screen.getByRole('button', {
    name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
  })

  await userEvent.click(button)

  expect(mockSetQueryParams).toHaveBeenNthCalledWith(1, {
    [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1,
  })
})

test('dispatches setHighlightedField and clearActivePolygons when button is clicked', async () => {
  render(<StudioTriggerButton />)

  const button = screen.getByRole('button', {
    name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
  })

  await userEvent.click(button)

  expect(setHighlightedField).toHaveBeenCalledWith(null)
  expect(clearActivePolygons).toHaveBeenCalled()
})

test('disables button when file status is not completed', async () => {
  useFetchFileQuery.mockReturnValue({
    data: {
      state: {
        status: FileStatus.PROCESSING,
      },
    },
  })

  render(<StudioTriggerButton />)

  const button = screen.getByRole('button', {
    name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
  })

  expect(button).toBeDisabled()
})
