
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import {
  changeActiveTab,
  highlightPolygonCoordsField,
  highlightTableCoordsField,
} from '@/actions/documentReviewPage'
import { ExtractedDataTabs } from '@/containers/DocumentExtractedData/ExtractedDataTabs'
import { DocumentState } from '@/enums/DocumentState'
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { GROUPING_TYPE } from '@/enums/GroupingTypeTabs'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import {
  DocumentTypeFieldMeta,
  TableFieldMeta,
  TableFieldColumn,
} from '@/models/DocumentTypeFieldMeta'
import {
  activeTabSelector,
  documentTypeSelector,
  fieldsGroupingSelector,
  documentSelector,
} from '@/selectors/documentReviewPage'
import {
  isDocumentDataFetchingSelector,
  isDocumentErrorGettingSelector,
} from '@/selectors/requests'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/requests')

jest.mock('@/actions/documentReviewPage', () => ({
  changeActiveTab: jest.fn(),
  highlightPolygonCoordsField: jest.fn(),
  highlightTableCoordsField: jest.fn(),
  getDocumentError: jest.fn(),
}))

jest.mock('@/containers/DocumentFields', () => mockComponent('DocumentFields'))
jest.mock('@/containers/DocumentExtractedData/ViewSwitcher', () => mockComponent('ViewSwitcher'))
jest.mock('@/containers/ConfidenceLevelDropdown', () => mockComponent('ConfidenceLevelDropdown'))
jest.mock('@/containers/DocumentExtractedData/withShouldHideEmptyEdFields', () => ({
  withShouldHideEmptyEdFields: jest.fn((connectedComponenet) => connectedComponenet),
}))

jest.mock('@/utils/env', () => mockEnv)

const { mapStateToProps, mapDispatchToProps, ConnectedComponent } = ExtractedDataTabs

const dtFields = [
  new DocumentTypeField(
    'tableCode',
    'Field table name',
    new TableFieldMeta([
      new TableFieldColumn('column title'),
    ]),
    FieldType.TABLE,
    true,
    3,
    'mockDocumentTypeCode',
    0,
  ),
  new DocumentTypeField(
    'verticalReference',
    'Vertical Reference',
    new DocumentTypeFieldMeta('BC', 'A'),
    FieldType.STRING,
    false,
    1,
    'mockDocumentTypeCode',
    1,
  ),
  new DocumentTypeField(
    'glElevation',
    'GL Elevation',
    new DocumentTypeFieldMeta('BC', 'A'),
    FieldType.STRING,
    false,
    2,
    'mockDocumentTypeCode',
    2,
  ),
  new DocumentTypeField(
    'fieldCode',
    'Field Name',
    new DocumentTypeFieldMeta('C', 'A'),
    FieldType.STRING,
    true,
    3,
    'mockDocumentTypeCode',
    3,
  ),
]

describe('Container: ExtractedDataTabs', () => {
  describe('mapStateToProps', () => {
    const mockState = 'MOCK_STATE'
    const { props } = mapStateToProps(mockState)

    it('should create correct state props object', () => {
      expect(props).toMatchSnapshot()
    })

    it('should call selector functions with state object', () => {
      expect(documentSelector).toHaveBeenCalledWith(mockState)
      expect(activeTabSelector).toHaveBeenCalledWith(mockState)
      expect(fieldsGroupingSelector).toHaveBeenCalledWith(mockState)
      expect(documentTypeSelector).toHaveBeenCalledWith(mockState)
    })
  })

  describe('component', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        documentType: new DocumentType(
          'testCode',
          'test name',
          'mockEngineCode',
          KnownLanguage.RUSSIAN,
          ExtractionType.TEMPLATE,
          dtFields,
        ),
        activeTab: '0',
        changeActiveTab: jest.fn(),
        highlightPolygonCoordsField: jest.fn(),
        highlightTableCoordsField: jest.fn(),
        fieldsGrouping: GROUPING_TYPE.USER_DEFINED,
        document: documentSelector.getSelectorMockValue(),
        documentDataFetching: isDocumentDataFetchingSelector.getSelectorMockValue(),
        fetching: isDocumentErrorGettingSelector.getSelectorMockValue(),
        updateConfidenceView: jest.fn(),
        getDocumentError: jest.fn(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout with user defined grouping', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with pages grouping', () => {
      defaultProps.fieldsGrouping = GROUPING_TYPE.BY_PAGE
      wrapper.setProps(defaultProps)
      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with set index grouping', () => {
      defaultProps.fieldsGrouping = GROUPING_TYPE.SET_INDEX
      wrapper.setProps(defaultProps)
      expect(wrapper).toMatchSnapshot()
    })

    const availableToEditStates = [
      DocumentState.NEEDS_REVIEW,
      DocumentState.IN_REVIEW,
      DocumentState.COMPLETED,
      DocumentState.EXPORTING,
      DocumentState.EXPORTED,
    ]
    const statesToSet = Object.values(DocumentState).filter((s) => !availableToEditStates.includes(s))
    for (const state of statesToSet) {
      it(`should render correct layout with Empty for empty extracted data and for ${state} document state`, () => {
        defaultProps.document.extractedData = []
        defaultProps.document.state = state
        const wrapper = shallow(<ConnectedComponent {...defaultProps} />)
        expect(wrapper).toMatchSnapshot()
      })
    }
  })

  describe('mapDispatchToProps', () => {
    let props
    beforeEach(() => {
      props = mapDispatchToProps().props
    })

    it('should pass changeActiveTab action as changeActiveTab property', () => {
      props.changeActiveTab()
      expect(changeActiveTab).toHaveBeenCalledTimes(1)
    })

    it('should call to highlightPolygonCoordsField action when calling to highlightPolygonCoordsField prop', () => {
      props.highlightPolygonCoordsField()
      expect(highlightPolygonCoordsField).toHaveBeenCalledTimes(1)
    })

    it('should call to highlightTableCoordsField action when calling to highlightTableCoordsField prop', () => {
      props.highlightTableCoordsField()
      expect(highlightTableCoordsField).toHaveBeenCalledTimes(1)
    })
  })
})
