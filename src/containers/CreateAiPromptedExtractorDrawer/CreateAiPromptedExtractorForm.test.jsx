
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import {
  Localization,
  localize,
} from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { CreateAiPromptedExtractorForm } from './CreateAiPromptedExtractorForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)

test('displays form layout correctly', () => {
  const props = {
    handleSubmit: jest.fn(),
    createAiPromptedExtractor: jest.fn(),
  }

  render(<CreateAiPromptedExtractorForm {...props} />)

  expect(screen.getByText(localize(Localization.NAME))).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))).toBeInTheDocument()
})
