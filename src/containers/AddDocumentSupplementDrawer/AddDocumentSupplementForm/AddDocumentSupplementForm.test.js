
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { render } from '@/utils/rendererRTL'
import { AddDocumentSupplementForm } from './AddDocumentSupplementForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)

const mockDocumentSupplement = new DocumentSupplement({
  name: '',
  type: FieldType.STRING,
  code: '12345',
  value: 'Mock Value',
})

const mockPrompt = 'mockPrompt'

test('shows all form inputs', () => {
  render(
    <AddDocumentSupplementForm
      createField={jest.fn()}
      field={mockDocumentSupplement}
      handleSubmit={jest.fn()}
      onFieldChange={jest.fn()}
    />,
  )

  expect(screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.VALUE_PLACEHOLDER))).toBeInTheDocument()
})

test('calls onFieldChange when the user clicks on the Set Prompt button', async () => {
  const onFieldChange = jest.fn()

  render(
    <AddDocumentSupplementForm
      createField={jest.fn()}
      field={mockDocumentSupplement}
      genAiPrompt={mockPrompt}
      handleSubmit={jest.fn()}
      onFieldChange={onFieldChange}
    />,
  )

  const setPromptButton = screen.getByRole('button', {
    name: localize(Localization.SET_PROMPT),
  })

  await userEvent.click(setPromptButton)

  expect(onFieldChange).toHaveBeenCalled()
})

test('shows correct tooltip text when the user hovers the Set Prompt button', async () => {
  render(
    <AddDocumentSupplementForm
      createField={jest.fn()}
      field={mockDocumentSupplement}
      genAiPrompt={mockPrompt}
      handleSubmit={jest.fn()}
      onFieldChange={jest.fn()}
    />,
  )

  const setPromptButton = screen.getByRole('button', {
    name: localize(Localization.SET_PROMPT),
  })

  await userEvent.hover(setPromptButton)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(mockPrompt)
  })
})
