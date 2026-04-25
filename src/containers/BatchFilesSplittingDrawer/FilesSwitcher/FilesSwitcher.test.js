
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { useFilesSplitting } from '../hooks'
import { SplittableFile } from '../viewModels'
import { FilesSwitcher } from '.'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../hooks', () => ({
  useFilesSplitting: jest.fn(() => ({
    currentFileIndex: 0,
    setCurrentFileIndex: mockSetCurrentFileIndex,
    splittableFiles: [mockFile],
  })),
}))

const mockSetCurrentFileIndex = jest.fn()

const mockFile = new SplittableFile({
  id: '1',
  source: 'file1.pdf',
  segments: [],
  batchName: 'batch1',
})

test('renders FilesSwitcher correctly', () => {
  render(<FilesSwitcher />)

  const buttons = screen.getAllByRole('button')

  expect(buttons.length).toBe(2)
})

test('disables previous button when current file index is 0', () => {
  render(<FilesSwitcher />)

  const previousButton = screen.getAllByRole('button')[0]

  expect(previousButton).toBeDisabled()
})

test('disables next button when current file index is the last file index', () => {
  render(<FilesSwitcher />)

  const nextButton = screen.getAllByRole('button')[1]

  expect(nextButton).toBeDisabled()
})

test('calls setCurrentFileIndex with correct value when previous button is clicked', async () => {
  useFilesSplitting.mockReturnValue({
    currentFileIndex: 1,
    setCurrentFileIndex: mockSetCurrentFileIndex,
    splittableFiles: [mockFile, mockFile],
  })

  render(<FilesSwitcher />)

  const previousButton = screen.getAllByRole('button')[0]
  await userEvent.click(previousButton)

  expect(mockSetCurrentFileIndex).toHaveBeenCalledWith(0)
})

test('calls setCurrentFileIndex with correct value when next button is clicked', async () => {
  useFilesSplitting.mockReturnValue({
    currentFileIndex: 0,
    setCurrentFileIndex: mockSetCurrentFileIndex,
    splittableFiles: [mockFile, mockFile],
  })

  render(<FilesSwitcher />)

  const nextButton = screen.getAllByRole('button')[1]
  await userEvent.click(nextButton)

  expect(mockSetCurrentFileIndex).toHaveBeenCalledWith(1)
})
