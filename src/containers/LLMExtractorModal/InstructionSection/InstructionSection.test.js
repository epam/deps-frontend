
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { InstructionSection } from './InstructionSection'

jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('@/utils/env', () => mockEnv)

test('renders Instruction field', () => {
  render(
    <InstructionSection />,
  )

  const textarea = screen.getByRole('textbox')

  expect(textarea).toHaveValue(localize(Localization.LLM_MODEL_CUSTOM_INSTRUCTION))
})
