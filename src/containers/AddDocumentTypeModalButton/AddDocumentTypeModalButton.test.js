
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { CreateAiPromptedExtractorDrawer } from '@/containers/CreateAiPromptedExtractorDrawer'
import { CreateAzureExtractorDrawer } from '@/containers/CreateAzureExtractorDrawer'
import { CreateTemplateDrawer } from '@/containers/CreateTemplateDrawer'
import { ExtractionType } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { AddDocumentTypeModalButton } from './AddDocumentTypeModalButton'
import {
  DocTypeModal,
  Title,
  TriggerButton,
  ListItem,
} from './AddDocumentTypeModalButton.styles'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/routerActions')

describe('Component: AddDocumentTypeModalButton', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AddDocumentTypeModalButton />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render AddDocumentTypeModalButton with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should open the modal when the button is clicked', () => {
    expect(wrapper.find(DocTypeModal).prop('open')).toBe(false)
    wrapper.find(TriggerButton).simulate('click')
    wrapper.update()
    expect(wrapper.find(DocTypeModal).prop('open')).toBe(true)
  })

  it('should close the opened modal after the modal onCancel prop was called', () => {
    wrapper.find(TriggerButton).simulate('click')
    wrapper.update()
    expect(wrapper.find(DocTypeModal).prop('open')).toBe(true)
    wrapper.find(DocTypeModal).prop('onCancel')()
    wrapper.update()
    expect(wrapper.find(DocTypeModal).prop('open')).toBe(false)
  })

  it('should not render template item in the modal if templates feature is toggled off', () => {
    ENV.FEATURE_TEMPLATES = false
    wrapper = shallow(<AddDocumentTypeModalButton />)

    expect(wrapper.find(CreateTemplateDrawer).exists()).toBe(false)

    ENV.FEATURE_TEMPLATES = true
  })

  it('should not render prototype item in the modal if prototypes feature is toggled off', () => {
    ENV.FEATURE_PROTOTYPES = false
    wrapper = shallow(<AddDocumentTypeModalButton />)
    const titles = wrapper.find(Title)
    const a = titles.map((i) => i.text())

    expect(a.includes(localize(Localization.PROTOTYPE))).toBe(false)

    ENV.FEATURE_PROTOTYPES = true
  })

  it('should not render ai-prompted extractor item in the modal if the feature flag for this option is toggled off', () => {
    ENV.FEATURE_AI_PROMPTED_EXTRACTORS = false
    wrapper = shallow(<AddDocumentTypeModalButton />)

    expect(wrapper.find(CreateAiPromptedExtractorDrawer).exists()).toBe(false)
    ENV.FEATURE_AI_PROMPTED_EXTRACTORS = true
  })

  it('should not render azure cloud extractor item in the modal if the feature flag for this option is toggled off', () => {
    ENV.FEATURE_AZURE_CLOUD_NATIVE_EXTRACTOR = false
    wrapper = shallow(<AddDocumentTypeModalButton />)

    expect(wrapper.find(CreateAzureExtractorDrawer).exists()).toBe(false)
    ENV.FEATURE_AZURE_CLOUD_NATIVE_EXTRACTOR = true
  })

  it('should call goTo with correct navigation url in case of prototype item click', () => {
    const items = wrapper.find(ListItem)
    items.at(2).props().onClick(ExtractionType.PROTOTYPE)

    expect(goTo).nthCalledWith(1, navigationMap.prototypes.createPrototype())
  })
})
