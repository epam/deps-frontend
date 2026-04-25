
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { Button } from '@/components/Button'
import { Cell, ExtractedDataField, FieldData, TableData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { Rect } from '@/models/Rect'
import {
  SourceBboxCoordinates,
  SourceCellCoordinate,
  SourceCellRange,
  SourceTableCoordinates,
} from '@/models/SourceCoordinates'
import { TableCoordinates } from '@/models/TableCoordinates'
import { Menu, Badge } from './CoordsHighlightTrigger.styles'
import { CoordsHighlightTrigger } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/env', () => mockEnv)

const mockSourceTableCoordinates = [
  new SourceTableCoordinates(
    'c626d5ee3c964e31aaf2e2c7170823ba',
    [
      new SourceCellRange(new SourceCellCoordinate(1, 2)),
      new SourceCellRange(new SourceCellCoordinate(3, 4)),
      new SourceCellRange(new SourceCellCoordinate(5, 6)),
    ],
  ),
]

const mockSourceBboxCoordinates = [
  new SourceBboxCoordinates(
    'c626d5ee3c964e31aaf2e2c7170823ba',
    1,
    [new Rect(1, 2, 3, 4), new Rect(1, 2, 3, 4)],
  ),
]

const mockMultiSourceBboxCoordinates = [
  ...mockSourceBboxCoordinates,
  new SourceBboxCoordinates(
    'f999d5ee3c964e31aaf2e2c7170823ba',
    1,
    [new Rect(1, 2, 3, 4), new Rect(1, 2, 3, 4)],
  ),
]

const mockTableCoordinates = [new TableCoordinates(1, [[1, 1], [2, 3]])]
const rows = [{ y: 0 }, { y: 0.5 }]
const columns = [{ x: 0 }, { x: 0.5 }]

const mockEdFieldWithMultipleCoordinates = new ExtractedDataField(
  1,
  new FieldData(
    350,
    [
      new FieldCoordinates(2, 0.19, 0.26, 0.80, 0.5),
      new FieldCoordinates(3, 0.19, 0.26, 0.80, 0.5),
    ],
    0.69,
  ),
)

const mockEdFieldWithSourceBboxCoordinates = new ExtractedDataField(
  1,
  new FieldData(
    330,
    null,
    0.55,
    null,
    null,
    null,
    mockMultiSourceBboxCoordinates,
  ),
)

const mockEdFieldWithSourceTableCoordinates = new ExtractedDataField(
  1,
  new FieldData(
    330,
    null,
    0.55,
    null,
    null,
    mockSourceTableCoordinates,
  ),
)

describe('Component: CoordsHighlightTrigger', () => {
  describe('ConnectedComponent', () => {
    let defaultProps, wrapper

    beforeEach(() => {
      defaultProps = {
        edField: new ExtractedDataField(
          1,
          new FieldData(
            350,
            new FieldCoordinates(2, 0.19, 0.26, 0.80, 0.5),
            0.69,
          ),
        ),
        setHighlightedField: jest.fn(),
        highlightArea: jest.fn(),
      }

      wrapper = shallow(<CoordsHighlightTrigger {...defaultProps} />)
    })

    it('should render correct layout based on the props', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with no coordinates and tableCoordinates', () => {
      defaultProps.edField = new ExtractedDataField(
        1,
        new FieldData(
          350,
          null,
          0.69,
        ),
      )

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with tableCoordinates', () => {
      defaultProps.edField = new ExtractedDataField(
        1,
        new FieldData(
          350,
          null,
          0.69,
          mockTableCoordinates,
        ),
      )

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with one tableCoordinate', () => {
      defaultProps.edField = new ExtractedDataField(
        1,
        new FieldData(
          350,
          null,
          0.69,
          [new TableCoordinates(1, [[1, 1]])],
        ),
      )

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with array of coordinates', () => {
      defaultProps.edField = mockEdFieldWithMultipleCoordinates

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with sourceTableCoordinates', () => {
      defaultProps.edField = mockEdFieldWithSourceTableCoordinates

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with sourceBboxCoordinates', () => {
      defaultProps.edField = mockEdFieldWithSourceBboxCoordinates

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with one cell in Table', () => {
      const cell = [
        new Cell(0, 0, '0 1', 2, 2, 1, 0.1, mockTableCoordinates),
      ]
      const tableFieldData1 = {
        ...new TableData(1, rows, columns, cell, undefined, undefined, mockTableCoordinates),
        index: 0,
      }
      defaultProps.edField = new ExtractedDataField(100, tableFieldData1)

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with several cells with different pages in Table', () => {
      const cells = [
        new Cell(0, 0, '0 1', 2, 2, 1, 0.1, [new TableCoordinates(1, [[2, 2]])]),
        new Cell(0, 2, '0 3', 1, 2, 1, 0.1, [new TableCoordinates(2, [[3, 3]])]),
      ]
      const tableFieldData1 = {
        ...new TableData(1, rows, columns, cells, undefined, undefined, mockTableCoordinates),
        index: 0,
      }
      defaultProps.edField = new ExtractedDataField(100, tableFieldData1)

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with several cells with sourceBboxCoordinates in Table', () => {
      const cells = [
        new Cell(0, 0, '0 1', 2, 2, 1, 0.1, undefined, undefined, mockSourceBboxCoordinates),
        new Cell(0, 0, '0 1', 2, 2, 1, 0.1, undefined, undefined, [
          new SourceBboxCoordinates('dadasdqe', 1, [new Rect(1, 2, 3, 4)]),
        ]),
      ]
      const tableFieldData1 = {
        ...new TableData(
          1, rows, columns, cells, undefined, undefined, undefined, undefined, undefined, mockSourceBboxCoordinates,
        ),
        index: 0,
      }
      defaultProps.edField = new ExtractedDataField(100, tableFieldData1)

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout with several cells with sourceTableCoordinates in Table', () => {
      const cells = [
        new Cell(0, 0, '0 1', 2, 2, 1, 0.1, undefined, mockSourceTableCoordinates),
        new Cell(0, 0, '0 1', 2, 2, 1, 0.1, undefined, [
          new SourceTableCoordinates(
            'dadasdqe',
            [new SourceCellRange(new SourceCellCoordinate(1, 2))],
          ),
        ]),
      ]
      const tableFieldData1 = {
        ...new TableData(
          1, rows, columns, cells, undefined, undefined, undefined, undefined, mockSourceTableCoordinates,
        ),
        index: 0,
      }
      defaultProps.edField = new ExtractedDataField(100, tableFieldData1)

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should correctly render Menu Option', () => {
      defaultProps.edField = mockEdFieldWithMultipleCoordinates

      wrapper.setProps(defaultProps)

      const menuOption = wrapper.find(Menu).props().items[0].content()
      const renderedMenuOption = shallow(<div>{menuOption}</div>)

      expect(renderedMenuOption).toMatchSnapshot()
    })

    it('should count prop of Badge Component be not equal to 0 if renderDropdownOptions is not empty', () => {
      defaultProps.edField = mockEdFieldWithMultipleCoordinates
      wrapper.setProps(defaultProps)
      const count = wrapper.find(Badge).props().count
      expect(count).toBeGreaterThan(0)
    })

    it('should call setHighlightedField when click on Option', () => {
      defaultProps.edField = mockEdFieldWithMultipleCoordinates

      wrapper.setProps(defaultProps)

      const menuOption = wrapper.find(Menu).props().items[0].content()
      menuOption.props.onClick()
      expect(defaultProps.highlightArea).toHaveBeenCalled()
    })

    it('should call highlightArea when click on Button if Table with one coord', () => {
      const cell = [
        new Cell(0, 0, '0 1', 2, 2, 1, 0.1, [new TableCoordinates(1, [[1, 1]])]),
      ]
      const tableFieldData1 = {
        ...new TableData(1, rows, columns, cell, undefined, undefined, [new TableCoordinates(1, [[1, 1]])]),
        index: 0,
      }
      defaultProps.edField = new ExtractedDataField(100, tableFieldData1)
      wrapper.setProps(defaultProps)
      wrapper.find(Button.Icon).props().onClick()

      expect(defaultProps.highlightArea).toHaveBeenCalledTimes(1)
    })

    it('should call setHighlightedField when click on Button if coordinates are object', () => {
      wrapper.find(Button.Icon).props().onClick()

      expect(defaultProps.setHighlightedField).toHaveBeenCalledTimes(1)
    })
  })
})
