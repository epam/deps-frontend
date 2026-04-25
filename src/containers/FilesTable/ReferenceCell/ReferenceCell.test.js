
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { goTo } from '@/actions/navigation'
import { FileReferenceType } from '@/enums/FileReferenceType'
import { Localization, localize } from '@/localization/i18n'
import { FileReference } from '@/models/File'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { ReferenceCell } from './ReferenceCell'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))

let defaultProps
const mockDispatch = jest.fn()
mockReactRedux.useDispatch.mockReturnValue(mockDispatch)

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    reference: new FileReference({
      entityId: 'mock-id',
      entityName: 'Mock Reference',
      entityType: FileReferenceType.BATCH,
    }),
  }
})

test('renders correctly with batch reference type', () => {
  render(<ReferenceCell {...defaultProps} />)

  expect(screen.getByText(defaultProps.reference.entityName)).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.BATCH))).toBeInTheDocument()
})

test('renders correctly with document reference type', () => {
  const documentReference = new FileReference({
    ...defaultProps.reference,
    entityType: FileReferenceType.DOCUMENT,
  })

  render(<ReferenceCell reference={documentReference} />)

  expect(screen.getByText(defaultProps.reference.entityName)).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.DOCUMENT))).toBeInTheDocument()
})

test('calls goTo with correct batch path', async () => {
  render(<ReferenceCell {...defaultProps} />)

  const navigationBatchPath = navigationMap.batches.batch(defaultProps.reference.entityId)

  const name = screen.getByText(defaultProps.reference.entityName)

  await userEvent.click(name)

  expect(mockDispatch).toHaveBeenCalledWith(goTo(navigationBatchPath))
})

test('calls goTo with correct document path', async () => {
  const documentReference = new FileReference({
    ...defaultProps.reference,
    entityType: FileReferenceType.DOCUMENT,
  })

  const navigationDocumentPath = navigationMap.documents.document(defaultProps.reference.entityId)

  render(<ReferenceCell reference={documentReference} />)

  const name = screen.getByText(defaultProps.reference.entityName)

  await userEvent.click(name)

  expect(mockDispatch).toHaveBeenCalledWith(goTo(navigationDocumentPath))
})
