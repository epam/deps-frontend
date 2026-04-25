
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { ExtractionType } from '@/enums/ExtractionType'
import { DocumentType } from '@/models/DocumentType'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { DashboardCards } from './DashboardCards'

jest.mock('@/utils/env', () => mockEnv)
const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector) => selector()),
}))

jest.mock('@/selectors/documentTypes', () => ({
  documentTypesStateSelector: jest.fn(() => mockData),
}))

jest.mock('@/selectors/requests', () => ({
  areTypesFetchingSelector: jest.fn(),
}))

jest.mock('@/actions/documentTypes', () => ({
  fetchDocumentTypes: jest.fn(() => ({ type: 'FETCH_DOCUMENT_TYPES' })),
}))

jest.mock('./AIPromptedCard', () => mockShallowComponent('AIPromptedCard'))
jest.mock('./AzureCloudNativeCard', () => mockShallowComponent('AzureCloudNativeCard'))
jest.mock('./DocumentsCard', () => mockShallowComponent('DocumentsCard'))
jest.mock('./ModelsCard', () => mockShallowComponent('ModelsCard'))
jest.mock('./PrototypesCard', () => mockShallowComponent('PrototypesCard'))
jest.mock('./TemplatesCard', () => mockShallowComponent('TemplatesCard'))
jest.mock('./UsersCard', () => mockShallowComponent('UsersCard'))

beforeEach(() => {
  jest.clearAllMocks()
  areTypesFetchingSelector.mockReturnValue(false)
})

const aiPromptedType1 = new DocumentType('type1', 'AI Type 1', 'engine1', undefined, null)
const aiPromptedType2 = new DocumentType('type2', 'AI Type 2', 'engine2', undefined, ExtractionType.AI_PROMPTED)
const template = new DocumentType('type3', 'Template', 'engine3', undefined, ExtractionType.TEMPLATE)
const prototype = new DocumentType('type4', 'Template', 'engine3', undefined, ExtractionType.PROTOTYPE)
const azureType = new DocumentType('type5', 'Template', 'engine3', undefined, ExtractionType.AZURE_CLOUD_EXTRACTOR)
const modelType = new DocumentType('type6', 'Template', 'engine3', undefined, ExtractionType.PLUGIN)

const mockData = {
  type1: aiPromptedType1,
  type2: aiPromptedType2,
  type3: template,
  type4: prototype,
  type5: azureType,
  type6: modelType,
}

test('should dispatch fetchDocumentTypes', () => {
  render(<DashboardCards />)

  expect(mockDispatch).toHaveBeenCalledWith(fetchDocumentTypes())
})

test('should render correct layout', () => {
  render(<DashboardCards />)

  const aiPromptedCard = screen.getByTestId('AIPromptedCard')
  const azureCloudNativeCard = screen.getByTestId('AzureCloudNativeCard')
  const documentsCard = screen.getByTestId('DocumentsCard')
  const modelsCard = screen.getByTestId('ModelsCard')
  const prototypesCard = screen.getByTestId('PrototypesCard')
  const templatesCard = screen.getByTestId('TemplatesCard')
  const usersCard = screen.getByTestId('UsersCard')

  expect(aiPromptedCard).toBeInTheDocument()
  expect(azureCloudNativeCard).toBeInTheDocument()
  expect(documentsCard).toBeInTheDocument()
  expect(modelsCard).toBeInTheDocument()
  expect(prototypesCard).toBeInTheDocument()
  expect(templatesCard).toBeInTheDocument()
  expect(usersCard).toBeInTheDocument()
})

test('should pass correct count of every extraction type to proper components', () => {
  render(<DashboardCards />)

  const aiPromptedCard = screen.getByTestId('AIPromptedCard')
  const azureCloudNativeCard = screen.getByTestId('AzureCloudNativeCard')
  const modelsCard = screen.getByTestId('ModelsCard')
  const prototypesCard = screen.getByTestId('PrototypesCard')
  const templatesCard = screen.getByTestId('TemplatesCard')

  expect(aiPromptedCard).toHaveAttribute('data-count', '2')
  expect(azureCloudNativeCard).toHaveAttribute('data-count', '1')
  expect(modelsCard).toHaveAttribute('data-count', '1')
  expect(prototypesCard).toHaveAttribute('data-count', '1')
  expect(templatesCard).toHaveAttribute('data-count', '1')
})

test('should render only DocumentsCard if all related env features are disabled', () => {
  ENV.FEATURE_TEMPLATES = false
  ENV.FEATURE_MACHINE_LEARNING_MODELS = false
  ENV.FEATURE_USER_MANAGEMENT = false
  ENV.FEATURE_PROTOTYPES = false
  ENV.FEATURE_AI_PROMPTED_EXTRACTORS = false
  ENV.FEATURE_AZURE_CLOUD_NATIVE_EXTRACTOR = false

  render(<DashboardCards />)

  const aiPromptedCard = screen.queryByTestId('AIPromptedCard')
  const azureCloudNativeCard = screen.queryByTestId('AzureCloudNativeCard')
  const documentsCard = screen.getByTestId('DocumentsCard')
  const modelsCard = screen.queryByTestId('ModelsCard')
  const prototypesCard = screen.queryByTestId('PrototypesCard')
  const templatesCard = screen.queryByTestId('TemplatesCard')
  const usersCard = screen.queryByTestId('UsersCard')

  expect(aiPromptedCard).not.toBeInTheDocument()
  expect(azureCloudNativeCard).not.toBeInTheDocument()
  expect(documentsCard).toBeInTheDocument()
  expect(modelsCard).not.toBeInTheDocument()
  expect(prototypesCard).not.toBeInTheDocument()
  expect(templatesCard).not.toBeInTheDocument()
  expect(usersCard).not.toBeInTheDocument()

  ENV.FEATURE_TEMPLATES = true
  ENV.FEATURE_MACHINE_LEARNING_MODELS = true
  ENV.FEATURE_USER_MANAGEMENT = true
  ENV.FEATURE_PROTOTYPES = true
  ENV.FEATURE_AI_PROMPTED_EXTRACTORS = true
  ENV.FEATURE_AZURE_CLOUD_NATIVE_EXTRACTOR = true
})
