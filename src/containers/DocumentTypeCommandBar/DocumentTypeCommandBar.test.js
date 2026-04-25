
import { mockEnv } from '@/mocks/mockEnv'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { goTo } from '@/actions/navigation'
import { DocumentFilterKeys } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { DocumentTypeCommandBar } from './DocumentTypeCommandBar'

const mockDocumentTypeCode = 'mockCode'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))

jest.mock('@/components/Icons/ExternalLinkAlt', () => ({
  ExternalLinkAltIcon: () => <div data-testid='external-link-icon' />,
}))

jest.mock('@/utils/env', () => mockEnv)

const mockDispatch = jest.fn()

test('should render tooltip with proper text when mouse over on the redirection icon button', async () => {
  render(<DocumentTypeCommandBar code={mockDocumentTypeCode} />)

  fireEvent.mouseOver(screen.getByTestId('external-link-icon'))

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.GO_TO_DOCUMENTS))
  })
})

test('should call goTo action when click on the redirection icon button', () => {
  render(<DocumentTypeCommandBar code={mockDocumentTypeCode} />)

  fireEvent.click(screen.getByTestId('external-link-icon'))

  expect(mockDispatch).toHaveBeenNthCalledWith(1, goTo(
    navigationMap.documents(),
    {
      filters: {
        [DocumentFilterKeys.TYPES]: [mockDocumentTypeCode],
      },
    },
  ))
})
