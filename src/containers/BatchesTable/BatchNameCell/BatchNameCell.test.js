
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { BatchFile } from '@/models/Batch'
import { render } from '@/utils/rendererRTL'
import { BatchNameCell } from './BatchNameCell'

jest.mock('@/utils/env', () => mockEnv)

const filesTagTestId = 'files-batch-tag'
const longTextTestId = 'long-text'

jest.mock('../FilesBatchCountTag', () => ({
  FilesBatchCountTag: ({ files }) => (
    <div data-testid={filesTagTestId}>{files.length}</div>
  ),
}))

jest.mock('@/components/LongText', () => ({
  LongText: ({ text }) => <span data-testid="long-text">{text}</span>,
}))

const name = 'Test Batch Name'
const files = [
  new BatchFile({
    name: 'test1',
    status: 'new',
    error: null,
  }),
  new BatchFile({
    name: 'test2  ',
    status: 'new',
    error: {
      message: 'error',
      code: 'error',
    },
  }),
]

test('BatchNameCell renders file count and name text', () => {
  const props = {
    files,
    name,
  }

  render(<BatchNameCell {...props} />)

  expect(screen.getByTestId(longTextTestId)).toHaveTextContent(name)
  expect(screen.getByTestId(filesTagTestId)).toHaveTextContent('2')
})
