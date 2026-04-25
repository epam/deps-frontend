
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AddDocumentSupplementButton } from './AddDocumentSupplementButton'

jest.mock('@/utils/env', () => mockEnv)

const MOCK_TYPE_CODE = 'MOCK_TYPE_CODE'
const MOCK_DOCUMENT_ID = 'MOCK_DOCUMENT_ID'

test('shows correct tooltip message when user hovers the trigger button', async () => {
  render(
    <AddDocumentSupplementButton
      disabled={false}
      documentId={MOCK_DOCUMENT_ID}
      documentSupplements={[]}
      documentTypeCode={MOCK_TYPE_CODE}
    />,
  )

  const addFieldButton = screen.getByRole('button')

  await userEvent.hover(addFieldButton)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.ADD_NEW_EXTRA_FIELD_TOOLTIP))
  })
})

test('shows drawer when trigger button is clicked', async () => {
  render(
    <AddDocumentSupplementButton
      disabled={false}
      documentId={MOCK_DOCUMENT_ID}
      documentSupplements={[]}
      documentTypeCode={MOCK_TYPE_CODE}
    />,
  )

  const addFieldButton = screen.getByRole('button')

  await userEvent.click(addFieldButton)

  await waitFor(() => {
    expect(screen.getByTestId('drawer')).toBeInTheDocument()
  })
})

test('displays disabled trigger button when passed disabled prop is true', async () => {
  render(
    <AddDocumentSupplementButton
      disabled={true}
      documentId={MOCK_DOCUMENT_ID}
      documentSupplements={[]}
      documentTypeCode={MOCK_TYPE_CODE}
    />,
  )

  await waitFor(() => {
    const addFieldButton = screen.getByRole('button')
    expect(addFieldButton).toBeDisabled()
  })
})
