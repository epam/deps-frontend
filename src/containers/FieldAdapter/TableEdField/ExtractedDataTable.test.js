
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Spin } from '@/components/Spin'
import { FieldPagination } from '@/containers/FieldPagination'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { FieldValidation } from '@/models/DocumentValidation'
import { Cell, ExtractedDataField, TableData } from '@/models/ExtractedData'
import { Rect } from '@/models/Rect'
import { ExtractedDataTable } from './ExtractedDataTable'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/ExtractedDataHandsonTable', () => mockComponent('ExtractedDataHandsonTable'))

const mockDtField = new DocumentTypeField(
  'table',
  'Table',
  null,
  FieldType.TABLE,
  false,
  0,
  'whole',
  2,
)

const mockEdField = new ExtractedDataField(
  2,
  new TableData(
    1,
    [{ y: 0 }],
    [{ x: 0 }],
    [new Cell(0, 0, '321')],
    new Rect(0.1, 0.2, 0.3, 0.4),
  ),
)

const mockFieldValidation = new FieldValidation(
  [{
    column: null,
    message: 'test error',
    index: null,
    row: null,
  }], [{
    column: null,
    message: 'test warning',
    index: null,
    row: null,
  }],
)

describe('Container: ExtractedDataTable', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      isChunkShouldBeFetched: false,
      dtField: mockDtField,
      disabled: false,
      edField: mockEdField,
      validation: mockFieldValidation,
      isPaginationDisplayed: false,
      paginationChangeHandler: jest.fn(),
      rowsPerChunk: 1,
      isChunkFetching: false,
      rowsChunk: 1,
      goToPage: jest.fn(),
    }
    wrapper = shallow(<ExtractedDataTable {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Spin, based on props', () => {
    defaultProps.isChunkShouldBeFetched = true

    wrapper.setProps(defaultProps)

    expect(wrapper.find(Spin).exists()).toBe(true)
  })

  it('should not render Pagination, if isPaginationDisplayed is falsy', () => {
    defaultProps.isPaginationDisplayed = false

    wrapper.setProps(defaultProps)

    expect(wrapper.find(FieldPagination).exists()).toEqual(false)
  })
})
