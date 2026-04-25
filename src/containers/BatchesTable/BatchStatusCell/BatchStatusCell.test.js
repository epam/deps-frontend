
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { BatchStatus, RESOURCE_BATCH_STATUS } from '@/enums/BatchStatus'
import { render } from '@/utils/rendererRTL'
import { BatchStatusCell } from './BatchStatusCell'

jest.mock('@/utils/env', () => mockEnv)

test('BatchStatusCell renders correct localized status text for each status', () => {
  Object.values(BatchStatus).forEach((status) => {
    render(<BatchStatusCell status={status} />)

    const expectedText = RESOURCE_BATCH_STATUS[status]
    expect(screen.getByText(expectedText)).toBeInTheDocument()
  })
})
