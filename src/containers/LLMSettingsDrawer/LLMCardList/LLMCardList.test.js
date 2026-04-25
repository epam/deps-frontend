
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { LLModel, LLMProvider, LLMSettings } from '@/models/LLMProvider'
import { render } from '@/utils/rendererRTL'
import { LLMCardList } from './LLMCardList'

jest.mock('@/utils/env', () => mockEnv)

const mockModels = [
  new LLModel({
    name: 'model1',
    code: 'model1Code',
    description: 'description1',
    contextType: LLMModelContextType.TEXT_BASED,
    provider: new LLMProvider({
      name: 'provider1',
      code: 'providerCode1',
    }),
  }),
  new LLModel({
    name: 'model2',
    code: 'model2Code',
    description: 'description2',
    contextType: LLMModelContextType.TEXT_BASED,
    provider: new LLMProvider({
      name: 'provider2',
      code: 'providerCode2',
    }),
  }),
]

const mockActiveLLMSettings = new LLMSettings({
  provider: 'providerCode',
  model: 'modelCode',
})

test('render LLMCardList correctly', async () => {
  const props = {
    setCurrentSettings: jest.fn(),
    currentSettings: mockActiveLLMSettings,
    models: mockModels,
  }

  render(<LLMCardList {...props} />)

  mockModels.forEach((model) => {
    expect(screen.getByText(model.description)).toBeInTheDocument()
  })
})

test('render no data image with title if no models are provided', async () => {
  const props = {
    setCurrentSettings: jest.fn(),
    currentSettings: mockActiveLLMSettings,
    models: [],
  }

  render(<LLMCardList {...props} />)

  expect(screen.getByText(/no data/i)).toBeInTheDocument()
})

test('calls setCurrentSettings prop when click on card', async () => {
  const props = {
    setCurrentSettings: jest.fn(),
    currentSettings: mockActiveLLMSettings,
    models: mockModels,
  }

  render(<LLMCardList {...props} />)

  await userEvent.click(screen.getByText(mockModels[0].description))

  expect(props.setCurrentSettings).toHaveBeenCalled()
})
