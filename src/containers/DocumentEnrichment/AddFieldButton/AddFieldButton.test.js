
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AddFieldButton } from './AddFieldButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/PlusFilledIcon', () => ({
  PlusFilledIcon: () => <span />,
}))

const MOCK_TYPE_CODE = 'MOCK_TYPE_CODE'
const MOCK_DOCUMENT_ID = 'MOCK_DOCUMENT_ID'

test('shows field adding drawer when button is clicked', async () => {
  render(
    <AddFieldButton
      disabled={false}
      documentId={MOCK_DOCUMENT_ID}
      documentSupplements={[]}
      documentTypeCode={MOCK_TYPE_CODE}
    />,
  )

  const addFieldButton = screen.getByRole('button', {
    name: localize(Localization.ADD_NEW_FIELD),
  })

  await userEvent.click(addFieldButton)

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})

test('add field button is disabled when passed disabled prop is true', async () => {
  render(
    <AddFieldButton
      disabled={true}
      documentId={MOCK_DOCUMENT_ID}
      documentSupplements={[]}
      documentTypeCode={MOCK_TYPE_CODE}
    />,
  )

  const addFieldButton = screen.getByRole('button', {
    name: localize(Localization.ADD_NEW_FIELD),
  })

  await waitFor(() => {
    expect(addFieldButton).toBeDisabled()
  })
})
