
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { LLModel, LLMProvider } from '@/models/LLMProvider'
import { render } from '@/utils/rendererRTL'
import { LLMCard } from './LLMCard'

jest.mock('@/utils/env', () => mockEnv)

const mockModel = (
  new LLModel({
    name: 'model1',
    code: 'model1Code',
    description: 'description1',
    contextType: LLMModelContextType.TEXT_BASED,
  })
)

const mockProvider = new LLMProvider({
  code: 'providerCode',
  name: 'providerName',
})

test('render LLMCard correctly', async () => {
  const props = {
    model: mockModel,
    onClick: jest.fn(),
    isActive: true,
  }

  render(<LLMCard {...props} />)

  expect(screen.getByText(mockModel.description, { exact: false })).toBeInTheDocument()
  expect(screen.getByText(mockModel.name)).toBeInTheDocument()
})

test('calls onClick prop when click on card', async () => {
  const props = {
    model: mockModel,
    onClick: jest.fn(),
    isActive: true,
    provider: mockProvider,
  }

  render(<LLMCard {...props} />)

  await userEvent.click(screen.getByText(mockModel.description))

  expect(props.onClick).nthCalledWith(1, mockModel.code, mockProvider.code)
})

test('shows provider name if showProviderName prop is provided', async () => {
  const props = {
    provider: new LLMProvider({
      code: 'providerCode',
      name: 'providerName',
    }),
    model: mockModel,
    onClick: jest.fn(),
    isActive: true,
    showProviderName: true,
  }

  render(<LLMCard {...props} />)

  expect(screen.getByText(props.provider.name)).toBeInTheDocument()
})
