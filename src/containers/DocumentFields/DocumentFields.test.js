
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NoData } from '@/components/NoData'
import { UiKeys } from '@/constants/navigation'
import { FieldAdapter } from '@/containers/FieldAdapter'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import {
  ExtractedDataField,
  FieldData,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import {
  LLMExtractionParams,
  LLMExtractionQuery,
  LLMExtractionQueryEdge,
  LLMExtractionQueryFormat,
  LLMExtractionQueryNode,
  LLMExtractionQueryWorkflow,
  LLMExtractor,
  LLMQueryCardinality,
  LLMQueryDataType,
  LLMReference,
} from '@/models/LLMExtractor'
import {
  documentTypeSelector,
  documentSelector,
  activeFieldTypesSelector,
} from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { isDocumentDataFetchingSelector } from '@/selectors/requests'
import { DocumentFields } from './'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/requests')
jest.mock('@/containers/FieldAdapter', () => mockComponent('FieldAdapter'))
jest.mock('@/utils/env', () => mockEnv)

const mockExtractionQueryCode = 'mockCode'

const mockExtractionQuery = new LLMExtractionQuery({
  code: mockExtractionQueryCode,
  shape: new LLMExtractionQueryFormat({
    dataType: LLMQueryDataType.STRING,
    cardinality: LLMQueryCardinality.SCALAR,
    includeAliases: false,
  }),
  workflow: new LLMExtractionQueryWorkflow({
    startNodeId: 'code1',
    endNodeId: 'code2',
    nodes: [
      new LLMExtractionQueryNode({
        id: 'nodeId',
        name: 'node name',
        prompt: 'mock prompt',
      }),
    ],
    edges: [
      new LLMExtractionQueryEdge({
        sourceId: 'code1',
        targetId: 'nodeId',
      }),
    ],
  }),
})

const mockLLMExtractor = new LLMExtractor({
  extractorId: 'extractorId',
  name: 'LLM Extractor Name',
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions',
    groupingFactor: 1,
    temperature: 0.5,
    topP: 0.3,
  }),
  llmReference: new LLMReference({
    model: 'mockModel',
    provider: 'mockProvider',
  }),
  queries: [mockExtractionQuery],
})

const {
  mapStateToProps,
  ConnectedComponent,
} = DocumentFields

describe('Container: DocumentFields', () => {
  describe('mapStateToProps', () => {
    it('should call documentSelector and pass the result as document prop', () => {
      const { props } = mapStateToProps()

      expect(documentSelector).toHaveBeenCalled()
      expect(props.document).toEqual(documentSelector.getSelectorMockValue())
    })

    it('should call documentTypeSelector and pass the result as documentType prop', () => {
      const { props } = mapStateToProps()

      expect(documentTypeSelector).toHaveBeenCalled()
      expect(props.documentType).toEqual(
        documentTypeSelector.getSelectorMockValue(),
      )
    })

    it('should call isDocumentDataFetchingSelector and pass the result as fetching prop', () => {
      const { props } = mapStateToProps()

      expect(isDocumentDataFetchingSelector).toHaveBeenCalled()
      expect(props.fetching).toEqual(
        isDocumentDataFetchingSelector.getSelectorMockValue(),
      )
    })

    it('should call uiSelector and pass the result as activeFieldPk prop', () => {
      const { props } = mapStateToProps()

      expect(uiSelector).toHaveBeenCalled()
      expect(props.activeFieldPk).toEqual(
        uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_FIELD_PK],
      )
    })

    it('should call activeFieldTypesSelector and pass the result as activeFieldTypes prop', () => {
      const { props } = mapStateToProps()

      expect(activeFieldTypesSelector).toHaveBeenCalled()
      expect(props.activeFieldTypes).toEqual(
        activeFieldTypesSelector.getSelectorMockValue(),
      )
    })
  })

  describe('ConnectedComponent', () => {
    let defaultProps, wrapper

    beforeEach(() => {
      defaultProps = {
        activeFieldPk: uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_FIELD_PK],
        fields: [
          new ExtractedDataField(
            1,
            new FieldData(350, new FieldCoordinates(2, 0.19, 0.26, 0.80, 0.5), 0.69),
          ),
          new ExtractedDataField(
            2,
            new FieldData(351, new FieldCoordinates(1, 0.2, 0.3, 0.4, 0.5), 0.69),
          ),
        ],
        document: documentSelector.getSelectorMockValue(),
        documentType: {
          ...documentTypeSelector.getSelectorMockValue(),
          fields: [
            new DocumentTypeField(
              'verticalReference1',
              'Vertical Reference',
              {},
              FieldType.DATE,
              false,
              0,
              'mockDocumentTypeCode',
              1,
            ),
            new DocumentTypeField(
              'glElevation',
              'GL Elevation',
              {},
              FieldType.STRING,
              false,
              0,
              'mockDocumentTypeCode',
              2,
            ),
          ],
          llmExtractors: [],
        },
        fetching: false,
        activeFieldTypes: activeFieldTypesSelector.getSelectorMockValue(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout for local error boundary', () => {
      const error = wrapper.find(ErrorBoundary).first().props().localBoundary()
      expect(error).toMatchSnapshot()
    })

    it('should show no data layout if activeFieldTypes is empty', () => {
      const props = {
        ...defaultProps,
        activeFieldTypes: [],
      }

      wrapper = shallow(<ConnectedComponent {...props} />)

      expect(wrapper.find(NoData).exists()).toBe(true)
    })

    it('should show only fields with a type present in activeFieldTypes', () => {
      const allowedFieldType = FieldType.DATE

      const props = {
        ...defaultProps,
        activeFieldTypes: [allowedFieldType],
        documentType: {
          ...documentTypeSelector.getSelectorMockValue(),
          fields: [
            new DocumentTypeField(
              'verticalReference1',
              'Vertical Reference',
              {},
              FieldType.DATE,
              false,
              0,
              'mockDocumentTypeCode',
              1,
            ),
            new DocumentTypeField(
              'glElevation',
              'GL Elevation',
              {},
              FieldType.STRING,
              false,
              0,
              'mockDocumentTypeCode',
              2,
            ),
          ],
          llmExtractors: [],
        },
      }

      wrapper = shallow(<ConnectedComponent {...props} />)

      const fields = wrapper.find(FieldAdapter)

      fields.forEach((f) => {
        expect(f.props().dtField.fieldType).toBe(allowedFieldType)
      })
    })

    it('should pass prompt chain prop if field has llm extractor', () => {
      const props = {
        ...defaultProps,
        documentType: {
          ...documentTypeSelector.getSelectorMockValue(),
          fields: [
            new DocumentTypeField(
              mockExtractionQueryCode,
              'Vertical Reference',
              {},
              FieldType.DATE,
              false,
              0,
              'mockDocumentTypeCode',
              1,
            ),
            new DocumentTypeField(
              'glElevation',
              'GL Elevation',
              {},
              FieldType.STRING,
              false,
              0,
              'mockDocumentTypeCode',
              2,
            ),
          ],
          llmExtractors: [mockLLMExtractor],
        },
      }

      wrapper = shallow(<ConnectedComponent {...props} />)

      const [Field] = wrapper.find(FieldAdapter)

      expect(Field.props.promptChain).toBe(mockExtractionQuery.workflow.nodes)
    })
  })
})
