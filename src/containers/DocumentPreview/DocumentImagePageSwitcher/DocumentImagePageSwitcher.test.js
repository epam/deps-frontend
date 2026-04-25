
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import * as React from 'react'
import { Cell, ExtractedDataField, TableData } from '@/models/ExtractedData'
import { Rect } from '@/models/Rect'
import {
  SourceBboxCoordinates,
  SourceCellCoordinate,
  SourceCellRange,
  SourceTableCoordinates,
} from '@/models/SourceCoordinates'
import { TableCoordinates } from '@/models/TableCoordinates'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import { DocumentImagePageSwitcher } from './DocumentImagePageSwitcher'
import { CenteredPageSwitcher } from './DocumentImagePageSwitcher.styles'

const mockSourceTableCoordinates = [
  new SourceTableCoordinates(
    'c626d5ee3c964e31aaf2e2c7170823ba',
    [new SourceCellRange(new SourceCellCoordinate(1, 2))],
  ),
]
const mockSourceBboxCoordinates = [
  new SourceBboxCoordinates(
    'c626d5ee3c964e31aaf2e2c7170823ba',
    1,
    [new Rect(1, 2, 3, 4), new Rect(1, 2, 3, 4)],
  ),
]
const mockTableCoordinates = [new TableCoordinates(1, [[1, 1], [2, 3]])]
const rows = [{ y: 0 }, { y: 0.5 }]
const columns = [{ x: 0 }, { x: 0.5 }]

const mockTableFieldData = (cells) => ({
  ...new TableData(1, rows, columns, cells),
  index: 0,
})

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/env', () => mockEnv)

const { ConnectedComponent } = DocumentImagePageSwitcher
describe('Container: DocumentImagePageSwitcher', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      document: documentSelector.getSelectorMockValue(),
      documentType: documentTypeSelector.getSelectorMockValue(),
      className: 'HiMan',
      pagesQuantity: 3,
      activePage: 1,
      disabled: false,
      onChangeActivePage: jest.fn(),
    }
    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct options if there are no coordinates', () => {
    const cells = [
      new Cell(0, 0, '0 1', 2, 2, 1, 0.1),
      new Cell(0, 0, '0 1', 2, 2, 1, 0.1),
    ]

    defaultProps.document = {
      ...documentSelector.getSelectorMockValue(),
      extractedData: [new ExtractedDataField(3, mockTableFieldData(cells))],
    }

    wrapper.setProps(defaultProps)
    const options = wrapper.find(CenteredPageSwitcher).props().pageOptions
    const renderOptions = shallow(<div>{options}</div>)
    expect(renderOptions).toMatchSnapshot()
  })

  it('should render "D" flags if there are tableCoordinates', () => {
    const cells = [
      new Cell(0, 0, '0 1', 2, 2, 1, 0.1, mockTableCoordinates),
      new Cell(0, 0, '0 1', 2, 2, 1, 0.1, [new TableCoordinates(2, [[3, 3]])]),
    ]

    defaultProps.document = {
      ...documentSelector.getSelectorMockValue(),
      extractedData: [new ExtractedDataField(3, mockTableFieldData(cells))],
    }

    wrapper.setProps(defaultProps)
    const options = wrapper.find(CenteredPageSwitcher).props().pageOptions
    const renderOptions = shallow(<div>{options}</div>)
    expect(renderOptions).toMatchSnapshot()
  })

  it('should render "D" flags if there are sourceBboxCoordinates', () => {
    const cells = [
      new Cell(0, 0, '0 1', 2, 2, 1, 0.1, undefined, undefined, mockSourceBboxCoordinates),
      new Cell(0, 0, '0 1', 2, 2, 1, 0.1, undefined, undefined, [new SourceBboxCoordinates('asdasdsdfgsg32asd123asd', 2, [])]),
    ]

    defaultProps.document = {
      ...documentSelector.getSelectorMockValue(),
      extractedData: [new ExtractedDataField(3, mockTableFieldData(cells))],
    }

    wrapper.setProps(defaultProps)
    const options = wrapper.find(CenteredPageSwitcher).props().pageOptions
    const renderOptions = shallow(<div>{options}</div>)
    expect(renderOptions).toMatchSnapshot()
  })

  it('should render "D" flags if there are sourceTableCoordinates', () => {
    const cells = [
      new Cell(0, 0, '0 1', 2, 2, 1, 0.1, undefined, mockSourceTableCoordinates),
      new Cell(0, 0, '0 1', 2, 2, 1, 0.1, undefined, [new SourceTableCoordinates('asdasdsdfgsg32asd123asd', [])]),
    ]

    defaultProps.document = {
      ...documentSelector.getSelectorMockValue(),
      extractedData: [new ExtractedDataField(3, mockTableFieldData(cells))],
    }

    wrapper.setProps(defaultProps)
    const options = wrapper.find(CenteredPageSwitcher).props().pageOptions
    const renderOptions = shallow(<div>{options}</div>)
    expect(renderOptions).toMatchSnapshot()
  })
})
