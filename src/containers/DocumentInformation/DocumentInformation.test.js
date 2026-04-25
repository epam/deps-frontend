
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ExtractionType, RESOURCE_EXTRACTION_TYPE } from '@/enums/ExtractionType'
import { localize, Localization } from '@/localization/i18n'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { Engine } from '@/models/Engine'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import { languagesSelector } from '@/selectors/languages'
import { navigationMap } from '@/utils/navigationMap'
import { DocumentInformation } from '.'

jest.mock('@/containers/DocumentLLMType', () => mockComponent('DocumentLLMType'))
jest.mock('@/containers/LabelTags', () => mockComponent('LabelTags'))
jest.mock('@/containers/ManageLabelsModalButton', () => mockComponent('ManageLabelsModalButton'))
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/languages', () => ({
  fetchAvailableLanguages: jest.fn(),
}))
jest.mock('@/actions/documentReviewPage', () => ({
  getDocumentError: jest.fn(),
}))
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/languages')
jest.mock('@/utils/env', () => mockEnv)

const {
  ConnectedComponent,
} = DocumentInformation

describe('ConnectedComponent', () => {
  let defaultProps, wrapper

  beforeEach(() => {
    defaultProps = {
      document: {
        ...documentSelector.getSelectorMockValue(),
        date: '02/14/2017, 3:00 AM',
        llmType: 'provider@model',
      },
      documentType: {
        ...documentTypeSelector.getSelectorMockValue(),
        name: 'Document Type Name',
      },
      engines: [new Engine('test', 'test')],
      languages: languagesSelector.getSelectorMockValue(),
      languagesFetching: true,
      fetching: true,
      fetchAvailableLanguages: jest.fn(),
      getDocumentError: jest.fn(),
      goTo: jest.fn(),
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render DocumentInformation with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render validation field with correct value in case of validation failed', () => {
    const mockValidation = {
      isValid: false,
      detail: [],
    }
    expect(wrapper.instance().renderValidationContent(mockValidation)).toBe(localize(Localization.FAILED_TEXT))
  })

  it('should render validation field with correct value in case of validation passed', () => {
    const mockValidation = {
      isValid: true,
      detail: [],
    }
    expect(wrapper.instance().renderValidationContent(mockValidation)).toBe(localize(Localization.PASSED_TEXT))
  })

  it('should render validation field with correct value in case of validation in null', () => {
    const mockValidation = null
    expect(wrapper.instance().renderValidationContent(mockValidation)).toBe(localize(Localization.NOT_APPLIED_TEXT))
  })

  it('should redirect to document type page on Type name item click if document has document type', async () => {
    const docType = documentTypeSelector.getSelectorMockValue()
    const typeName = shallow(<div>{wrapper.instance().renderDocumentTypeName(docType)}</div>)
    const typeNameButton = typeName.props().children

    await typeNameButton.props.onClick()

    expect(defaultProps.goTo).nthCalledWith(
      1,
      navigationMap.documentTypes.documentType(defaultProps.documentType.code),
    )
  })

  it('should renders Type name item as simple text if document has Unknown type', async () => {
    const typeName = shallow(<div>{wrapper.instance().renderDocumentTypeName(UNKNOWN_DOCUMENT_TYPE)}</div>)

    expect(typeName.props().children).toEqual(UNKNOWN_DOCUMENT_TYPE.name)
  })

  it('should not render Type item when document type is Unknown', () => {
    const typeItem = wrapper.instance().renderExtractionType(UNKNOWN_DOCUMENT_TYPE)
    expect(typeItem).toBeNull()
  })

  it('should render Extraction type when extractionType is defined', () => {
    const extractionType = ExtractionType.TEMPLATE

    const docType = {
      ...documentTypeSelector.getSelectorMockValue(),
      extractionType,
    }

    const typeItem = wrapper.instance().renderExtractionType(docType)
    expect(typeItem).toBe(RESOURCE_EXTRACTION_TYPE[extractionType])
  })

  it('should render Ai-Prompted extractor when extractionType is null', () => {
    const docType = {
      ...documentTypeSelector.getSelectorMockValue(),
      extractionType: null,
    }

    const typeItem = wrapper.instance().renderExtractionType(docType)
    expect(typeItem).toBe(RESOURCE_EXTRACTION_TYPE[ExtractionType.AI_PROMPTED])
  })
})
