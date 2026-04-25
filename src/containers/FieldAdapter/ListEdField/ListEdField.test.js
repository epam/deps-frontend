
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { mockUuid } from '@/mocks/mockUuid'
import { shallow } from 'enzyme'
import { highlightTableCoordsField, highlightPolygonCoordsField } from '@/actions/documentReviewPage'
import { ListCoordsHighlightTrigger } from '@/containers/CoordsHighlightTrigger'
import { ValidationIcons } from '@/containers/FieldAdapter/ListEdField/ValidationIcons'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import {
  DocumentTypeFieldMeta,
  ListFieldMeta,
} from '@/models/DocumentTypeFieldMeta'
import { FieldValidation } from '@/models/DocumentValidation'
import { DictFieldData, ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { Rect } from '@/models/Rect'
import {
  SourceBboxCoordinates,
  SourceCellCoordinate,
  SourceCellRange,
  SourceTableCoordinates,
} from '@/models/SourceCoordinates'
import { documentSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { Flags } from '../Flags'
import { ListEdField } from './ListEdField'
import { ListItemWrapper } from './ListEdField.styles'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('../KeyValuePairEdField', () => mockComponent('KeyValuePairEdField'))
jest.mock('../TableEdField', () => mockComponent('TableEdField'))
jest.mock('../AddOrEditFieldAliasButton', () => mockComponent('AddOrEditFieldAliasButton'))

jest.mock('@/actions/documentReviewPage', () => ({
  highlightTableCoordsField: jest.fn(),
  highlightPolygonCoordsField: jest.fn(),
}))

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    saveEdField: jest.fn(),
  },
}))

jest.mock('@/selectors/documentReviewPage')
jest.mock('@/containers/InView', () => ({
  ...jest.requireActual('@/containers/InView'),
  InView: () => 'InView',
}))

const mockSubFieldId = 'subFieldId'

const mockDtField = new DocumentTypeField(
  'listStrs',
  'list Strs',
  new ListFieldMeta(FieldType.STRING, new DocumentTypeFieldMeta()),
  FieldType.LIST,
  false,
  0,
  'whole',
  730,
)

const mockEdField = new ExtractedDataField(
  730,
  [
    new FieldData(
      'Confirm before collaction',
      new FieldCoordinates(
        2,
        0.524590163934,
        0.364864406204,
        0.15,
        0.041365441401,
      ),
      null,
      null,
      0,
      null,
      null,
      null,
      null,
      null,
      mockSubFieldId,
    ),
    new FieldData(
      'aaa',
      new FieldCoordinates(
        1,
        0.815573770492,
        0.118793062485,
        0.081967213115,
        0.083791535146,
      ),
      null,
      null,
      1,
    ),
  ],
  null,
  {
    [mockSubFieldId]: 'list Strs - Sub field 1 - Alias',
  },
)

const mockUseListItemsAliases = ({
  isSaving: false,
  onSave: jest.fn(() => jest.fn()),
})

jest.mock('./useListItemsAliases', () => ({
  useListItemsAliases: jest.fn(() => mockUseListItemsAliases),
}))

jest.mock('uuid', () => mockUuid)

const { ConnectedComponent, mapDispatchToProps, mapStateToProps } = ListEdField
const mockDocumentId = documentSelector.getSelectorMockValue()._id

describe('Containers: ListEdField', () => {
  describe('mapDispatchToProps', () => {
    it('should call to highlightPolygonCoordsField action when calling to highlightPolygonCoordsField prop', () => {
      const { props } = mapDispatchToProps()

      props.highlightPolygonCoordsField()
      expect(highlightPolygonCoordsField).toHaveBeenCalledTimes(1)
    })

    it('should call to highlightTableCoordsField action when calling to highlightTableCoordsField prop', () => {
      const { props } = mapDispatchToProps()

      props.highlightTableCoordsField()
      expect(highlightTableCoordsField).toHaveBeenCalledTimes(1)
    })
  })

  describe('mapStateToProps', () => {
    it('should call documentSelector and pass the result as document prop', () => {
      const { props } = mapStateToProps()

      expect(documentSelector).toHaveBeenCalled()
      expect(props.document).toEqual(documentSelector.getSelectorMockValue())
    })
  })

  describe('as a component', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        document: documentSelector.getSelectorMockValue(),
        active: true,
        disabled: false,
        dtField: mockDtField,
        edField: mockEdField,
        validation: new FieldValidation(
          [
            {
              column: null,
              row: null,
              index: null,
              message: 'Mock Error 1',
            },
            {
              column: null,
              row: null,
              index: 0,
              message: 'Mock Error 2',
            },
          ],
          [
            {
              column: null,
              row: null,
              index: null,
              message: 'Mock Warning 1',
            },
            {
              column: null,
              row: null,
              index: 0,
              message: 'Mock Warning 2',
            },
          ],
        ),
        documentId: mockDocumentId,
        highlightPolygonCoordsField: jest.fn(),
        highlightTableCoordsField: jest.fn(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should pass all validation issues to ValidationIcons including item-level errors', () => {
      const validationIcons = wrapper.find(ValidationIcons)
      expect(validationIcons.exists()).toBe(true)

      const validationProp = validationIcons.prop('validation')

      expect(validationProp.errors).toEqual([
        {
          column: null,
          row: null,
          index: null,
          message: 'Mock Error 1',
        },
        {
          column: null,
          row: null,
          index: 0,
          message: 'Mock Error 2',
        },
      ])

      expect(validationProp.warnings).toEqual([
        {
          column: null,
          row: null,
          index: null,
          message: 'Mock Warning 1',
        },
        {
          column: null,
          row: null,
          index: 0,
          message: 'Mock Warning 2',
        },
      ])
    })

    it('should not render ListCoordsHighlightTrigger if no coords in list fields', () => {
      defaultProps.edField = new ExtractedDataField(
        730,
        [
          new FieldData('Confirm'),
          new FieldData('aaa'),
        ],
      )

      wrapper.setProps(defaultProps)
      expect(wrapper).toMatchSnapshot()
    })

    it('should sort highlightedCoords by pages', () => {
      const resultCoords = [
        {
          page: 1,
          coordinates: [
            new Rect(
              0.815573770492,
              0.118793062485,
              0.081967213115,
              0.083791535146,
            ),
          ],
        },
        {
          page: 2,
          coordinates: [
            new Rect(
              0.524590163934,
              0.364864406204,
              0.15,
              0.041365441401,
            ),
          ],
        },
      ]

      expect(wrapper.find(ListCoordsHighlightTrigger).props().coords).toEqual(resultCoords)
    })

    it('should render ListCoordsHighlightTrigger correctly with keyValueFields', () => {
      defaultProps = {
        ...defaultProps,
        dtField: {
          ...mockDtField,
          fieldMeta: new ListFieldMeta(
            FieldType.DICTIONARY,
            new DocumentTypeFieldMeta(),
          ),
        },
        edField: new ExtractedDataField(
          730,
          [
            new DictFieldData(
              new FieldData(
                'Confirm before collaction',
                new FieldCoordinates(
                  1,
                  0.524590163934,
                  0.364864406204,
                  0.15,
                  0.041365441401,
                ),
              ),
              new FieldData(
                'aaa',
                new FieldCoordinates(
                  2,
                  0.815573770492,
                  0.118793062485,
                  0.081967213115,
                  0.083791535146,
                ),
              ),
            ),
          ],
        ),
      }

      wrapper.setProps(defaultProps)
      expect(wrapper).toMatchSnapshot()
    })

    it('should call to highlightPolygonCoordsField in case of highlighting field with sourceBboxCoordinates', () => {
      defaultProps.edField = new ExtractedDataField(
        1,
        [
          new FieldData(
            'value',
            null,
            0.55,
            null,
            null,
            null,
            [
              new SourceBboxCoordinates(
                'sourceId',
                1,
                [
                  new Rect(1, 2, 3, 4),
                  new Rect(1, 2, 3, 4),
                ],
              ),
            ],
          ),
        ],
      )
      wrapper.setProps(defaultProps)
      wrapper.find(ListCoordsHighlightTrigger).props().highlightArea()

      expect(defaultProps.highlightPolygonCoordsField).toHaveBeenCalled()
    })

    it('should call to highlightTableCoordsField in case of highlighting field with sourceTableCoordinates', () => {
      defaultProps.edField = new ExtractedDataField(
        1,
        [
          new FieldData(
            'value',
            null,
            0.55,
            null,
            null,
            [
              new SourceTableCoordinates(
                'sourceId',
                [
                  new SourceCellRange(new SourceCellCoordinate(1, 2)),
                  new SourceCellRange(new SourceCellCoordinate(3, 4)),
                ],
              ),
            ],
          ),
        ],
      )
      wrapper.setProps(defaultProps)
      wrapper.find(ListCoordsHighlightTrigger).props().highlightArea()

      expect(defaultProps.highlightTableCoordsField).toHaveBeenCalled()
    })

    it('should pass correct additional action menu items', () => {
      const edFieldWrapper = wrapper.find(ListItemWrapper).first().childAt(0).children()
      const actionsMenu = edFieldWrapper.props().renderActions()

      actionsMenu.props.extraActions.forEach((item) => {
        expect(shallow(<div>{item.content()}</div>)).toMatchSnapshot()
      })
    })

    it('should pass field confidence to the Flags', () => {
      defaultProps = {
        ...defaultProps,
        edField: {
          ...mockEdField,
          confidence: 0.8,
        },
      }

      wrapper.setProps(defaultProps)

      expect(wrapper.find(Flags).props().confidence).toEqual(defaultProps.edField.confidence)
    })

    it('should not pass empty field confidence to the Flags', () => {
      expect(wrapper.find(Flags).props()).not.toHaveProperty('confidence')
    })

    it('should pass empty field confidence to the Flags if feature flag FEATURE_SHOW_NOT_APPLICABLE_CONFIDENCE is on', () => {
      ENV.FEATURE_SHOW_NOT_APPLICABLE_CONFIDENCE = true
      wrapper.setProps(defaultProps)

      expect(wrapper.find(Flags).props()).toHaveProperty('confidence')

      ENV.FEATURE_SHOW_NOT_APPLICABLE_CONFIDENCE = false
    })

    it('should not render validation icons if field does not have validation errors and warnings', () => {
      defaultProps.validation = new FieldValidation([], [])
      wrapper.setProps(defaultProps)
      expect(wrapper.find(ValidationIcons).exists()).toBe(false)
    })
  })
})
