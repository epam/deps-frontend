
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { BatchNameInput } from './BatchNameInput'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/PdfSplitting/hooks', () => ({
  usePdfSegments: () => ({
    setBatchName: mockSetBatchName,
    batchName: mockBatchName,
  }),
}))

const mockSetBatchName = jest.fn()
const mockBatchName = ''

test('renders BatchNameInput component correctly', () => {
  render(<BatchNameInput />)

  const label = screen.getByText(localize(Localization.BATCH_NAME))
  const input = screen.getByRole('textbox')

  expect(label).toBeInTheDocument()
  expect(input).toBeInTheDocument()
})

test('calls setBatchName when type inside input', async () => {
  const mockLetter = 'A'

  render(<BatchNameInput />)

  const input = screen.getByRole('textbox')
  await userEvent.type(input, mockLetter)

  expect(mockSetBatchName).nthCalledWith(1, mockLetter)
})
