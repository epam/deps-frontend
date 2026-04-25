
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { Localization, localize } from '@/localization/i18n'
import { LLModel, LLMProvider } from '@/models/LLMProvider'
import { render } from '@/utils/rendererRTL'
import { LLMProviderSelect } from './LLMProviderSelect'

jest.mock('@/utils/env', () => mockEnv)

const mockActiveProviderCode = 'providerCode'

const mockProviders = [
  new LLMProvider({
    code: 'providerCode',
    name: 'provider',
    models: [
      new LLModel({
        name: 'model',
        code: 'modelCode',
        description: 'description',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
    ],
  }),
]

test('render LLMProviderSelect correctly', async () => {
  const props = {
    onChange: jest.fn(),
    providers: mockProviders,
    activeProviderCode: mockActiveProviderCode,
  }

  render(<LLMProviderSelect {...props} />)

  expect(screen.getByText(localize(Localization.PROVIDER))).toBeInTheDocument()
  expect(screen.getByRole('combobox')).toBeInTheDocument()
})

test('displays correct placeholder text if no active provider', async () => {
  const props = {
    onChange: jest.fn(),
    providers: mockProviders,
  }

  render(<LLMProviderSelect {...props} />)

  expect(screen.getByText(localize(Localization.SELECT_PROVIDER))).toBeInTheDocument()
})
