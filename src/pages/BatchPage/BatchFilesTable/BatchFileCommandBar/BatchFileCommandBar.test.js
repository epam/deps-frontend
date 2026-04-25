
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { BatchFile } from '@/models/Batch'
import { render } from '@/utils//rendererRTL'
import { BatchFileCommandBar } from './BatchFileCommandBar'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DeleteBatchFiles', () => mockShallowComponent('DeleteBatchFiles'))
jest.mock('@/actions/navigation')

const mockBatchFile = BatchFile.getMinimized({
  error: null,
  name: 'file name',
  status: 'completed',
})

test('renders DeleteBatchFiles command', async () => {
  const props = {
    file: mockBatchFile,
  }

  render(<BatchFileCommandBar {...props} />)

  const deleteCommand = screen.getByTestId('DeleteBatchFiles')

  expect(deleteCommand).toBeInTheDocument()
})
