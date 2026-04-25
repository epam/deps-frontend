
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { MoreFieldsActions } from './MoreFieldsActions'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/AddBusinessRule', () => ({
  AddBusinessRule: () => (
    <button data-testid="add-business-rule-button" />
  ),
}))

test('renders add business rule button within a dropdown menu', async () => {
  render(
    <MoreFieldsActions
      disabled={false}
    />,
  )

  const moreButton = screen.getByRole('button')
  await userEvent.click(moreButton)

  const actionsMenu = screen.getByRole('menu')
  const addBusinessRule = screen.getByTestId('add-business-rule-button')

  expect(actionsMenu).toBeInTheDocument()
  expect(addBusinessRule).toBeInTheDocument()
})

test('renders null when FEATURE_VALIDATION_BUSINESS_RULES is false', async () => {
  ENV.FEATURE_VALIDATION_BUSINESS_RULES = false

  const { container } = render(
    <MoreFieldsActions
      disabled={false}
    />,
  )

  expect(container).toBeEmptyDOMElement()

  ENV.FEATURE_VALIDATION_BUSINESS_RULES = true
})

test('passes disabled prop to ActionsMenu', () => {
  render(
    <MoreFieldsActions
      disabled={true}
    />,
  )

  const moreButton = screen.getByRole('button')

  expect(moreButton).toBeDisabled()
})
