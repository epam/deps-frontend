
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { goTo } from '@/actions/navigation'
import {
  FileReferenceType,
  REFERENCE_TYPE_LOCALIZATION,
} from '@/enums/FileReferenceType'
import { FileReference } from '@/models/File'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { FileReferenceInfo } from './FileReferenceInfo'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))

jest.mock('./FileReferenceInfo.styles', () => ({
  ...jest.requireActual('./FileReferenceInfo.styles'),
  ReferenceContainer: ({ children, onClick }) => (
    <div
      data-testid="reference-container"
      onClick={onClick}
    >
      {children}
    </div>
  ),
}))

const mockDispatch = jest.fn()

const fileReference = new FileReference({
  entityType: FileReferenceType.BATCH,
  entityId: 'test-entity-id',
  entityName: 'test-entity-name',
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders FileReferenceInfo correctly', () => {
  render(<FileReferenceInfo reference={fileReference} />)

  expect(screen.getByText(fileReference.entityName)).toBeInTheDocument()
  expect(screen.getByText(REFERENCE_TYPE_LOCALIZATION[fileReference.entityType])).toBeInTheDocument()
})

test('calls goTo when clicked', async () => {
  render(<FileReferenceInfo reference={fileReference} />)

  const container = screen.getByTestId('reference-container')

  await userEvent.click(container)

  expect(mockDispatch).toHaveBeenCalledWith(
    goTo(navigationMap.batches.batch(fileReference.entityId)),
  )
})
