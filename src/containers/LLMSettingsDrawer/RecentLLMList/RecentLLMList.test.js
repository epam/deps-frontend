
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { Localization, localize } from '@/localization/i18n'
import { LLModel, LLMProvider } from '@/models/LLMProvider'
import { render } from '@/utils/rendererRTL'
import { RecentLLMList } from './RecentLLMList'

jest.mock('@/utils/env', () => mockEnv)

const mockConfigs = [
  {
    provider: new LLMProvider({
      code: 'dial1Code',
      name: 'dial1Name',
    }),
    model: new LLModel({
      name: 'model1',
      code: 'model1Code',
      description: 'description1',
      contextType: LLMModelContextType.TEXT_BASED,
    }),
  },
  {
    provider: new LLMProvider({
      code: 'dial2Code',
      name: 'dial2Name',
    }),
    model: new LLModel({
      name: 'model2',
      code: 'model2Code',
      description: 'description2',
      contextType: LLMModelContextType.TEXT_BASED,
    }),
  },
]

test('render RecentLLMList correctly', async () => {
  const props = {
    llmConfigs: mockConfigs,
    setCurrentSettings: jest.fn(),
  }

  render(<RecentLLMList {...props} />)

  expect(screen.getByText(localize(Localization.RECENT_MODELS))).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button'))

  mockConfigs.forEach(({ provider }) => {
    expect(screen.getByText(provider.name)).toBeInTheDocument()
  })
})

test('calls setCurrentSettings prop when click on card', async () => {
  const props = {
    llmConfigs: mockConfigs,
    setCurrentSettings: jest.fn(),
  }

  render(<RecentLLMList {...props} />)

  await userEvent.click(screen.getByRole('button'))

  await userEvent.click(screen.getByText(mockConfigs[0].model.description))

  expect(props.setCurrentSettings).toHaveBeenCalled()
})
