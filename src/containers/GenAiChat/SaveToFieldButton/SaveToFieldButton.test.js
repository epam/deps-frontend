
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createField } from '@/actions/genAiData'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { SaveToFieldButton } from './SaveToFieldButton'

const saveButtonTestId = 'save-to-field-button'
const mockPrompt = 'mockPrompt'
const mockAnswer = 'mockAnswer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/selectors/documentReviewPage')

jest.mock('@/components/Icons/CommentPlusIcon', () => ({
  CommentPlusIcon: () => <div data-testid={saveButtonTestId} />,
}))

const mockCreateFieldAction = {
  type: createField.toString(),
}

jest.mock('@/actions/genAiData', () => ({
  createField: jest.fn(() => mockCreateFieldAction),
}))

test('creates key-value field when user clicks on the trigger button and FEATURE_GEN_AI_KEY_VALUE_FIELDS is true', async () => {
  ENV.FEATURE_GEN_AI_KEY_VALUE_FIELDS = true

  render(
    <SaveToFieldButton
      answer={mockAnswer}
      prompt={mockPrompt}
    />,
  )

  const saveButton = screen.getByTestId(saveButtonTestId)
  await userEvent.click(saveButton)

  expect(createField).nthCalledWith(1,
    {
      key: mockPrompt,
      value: mockAnswer,
    },
  )
  expect(mockNotification.notifyProgress).nthCalledWith(1, localize(Localization.CREATE_GEN_AI_FIELD_MESSAGE_IN_PROGRESS))
  expect(mockNotification.notifySuccess).nthCalledWith(1, localize(Localization.CREATE_GEN_AI_FIELD_MESSAGE))

  ENV.FEATURE_GEN_AI_KEY_VALUE_FIELDS = false
})

test('shows drawer to add document supplement when the user clicks on the trigger button and FEATURE_GEN_AI_KEY_VALUE_FIELDS is off', async () => {
  render(
    <SaveToFieldButton
      answer={mockAnswer}
      prompt={mockPrompt}
    />,
  )

  const saveButton = screen.getByTestId(saveButtonTestId)
  await userEvent.click(saveButton)

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})

test('shows correct tooltip text when the user hovers the trigger button', async () => {
  render(
    <SaveToFieldButton
      answer={mockAnswer}
      prompt={mockPrompt}
    />,
  )

  const saveButton = screen.getByTestId(saveButtonTestId)
  await userEvent.hover(saveButton)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.SAVE_AI_RESPONSE_TO_FIELD))
  })
})
