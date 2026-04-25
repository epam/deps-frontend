
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AddDocumentTypeFieldModalButton } from './AddDocumentTypeFieldModalButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./AddExtraFieldSection', () => ({
  AddExtraFieldSection: () => <div data-testid={'add-extra-field'} />,
}))
jest.mock('./AddGenAiDrivenFieldSection', () => ({
  AddGenAiDrivenFieldSection: () => <div data-testid={'add-genAi-field'} />,
}))

const doRenderAndClickOnModalButton = async () => {
  render(<AddDocumentTypeFieldModalButton />)

  const button = screen.getByRole('button', {
    name: localize(Localization.ADD_FIELD),
  })

  await userEvent.click(button)
}

test('shows modal with correct title and content after click on a trigger button', async () => {
  await doRenderAndClickOnModalButton()

  const modal = screen.getByRole('dialog')
  const modalTitle = within(modal).getByText(localize(Localization.SELECT_FIELD_CATEGORY))
  const addExtraFieldItem = screen.getByTestId('add-extra-field')
  const addGenAiFieldItem = screen.getByTestId('add-genAi-field')

  expect(modalTitle).toBeInTheDocument()
  expect(addExtraFieldItem).toBeInTheDocument()
  expect(addGenAiFieldItem).toBeInTheDocument()
})
