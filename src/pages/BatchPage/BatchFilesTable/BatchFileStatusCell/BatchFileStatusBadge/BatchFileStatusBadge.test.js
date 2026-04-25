
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { BatchFileStatus, RESOURCE_BATCH_FILE_STATUS } from '@/enums/BatchFileStatus'
import { render } from '@/utils/rendererRTL'
import { BatchFileStatusBadge } from './BatchFileStatusBadge'

jest.mock('@/utils/env', () => mockEnv)

test('BatchFileStatusBadge renders correct localized status text for each status', () => {
  Object.values(BatchFileStatus).forEach((status) => {
    render(<BatchFileStatusBadge status={status} />)

    const expectedText = RESOURCE_BATCH_FILE_STATUS[status]
    expect(screen.getByText(expectedText)).toBeInTheDocument()
  })
})
