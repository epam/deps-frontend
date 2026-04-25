
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockLocalStorageWrapper } from '@/mocks/mockLocalStorageWrapper'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { fetchPaginatedEdTable } from '@/actions/documents'
import { TABLE_FIELD_PAGINATION } from '@/constants/storage'
import { FieldValidationResult } from '@/containers/FieldAdapter/FieldValidationResult'
import { FieldPagination } from '@/containers/FieldPagination'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { FieldValidation } from '@/models/DocumentValidation'
import {
  ExtractedDataField,
  Cell,
  TableData,
} from '@/models/ExtractedData'
import { Rect } from '@/models/Rect'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { shallowWithTheme } from '@/utils/shallowWithTheme'
import { ExtractedDataTable } from './ExtractedDataTable'
import { TableEdField } from './TableEdField'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/containers/InView', () => mockComponent('InView'))
jest.mock('@/containers/ExtractedDataHandsonTable', () => mockComponent('ExtractedDataHandsonTable'))
jest.mock('../useFieldProps', () => ({
  useFieldProps: jest.fn(() => ({
    onChangeData: jest.fn(),
    onFocus: jest.fn(),
    setHighlightedField: jest.fn(),
    highlightArea: jest.fn(),
    revertValue: jest.fn(),
    isRevertDisabled: false,
  })),
}))
jest.mock('../useCommandExtractionProps', () => ({
  useCommandExtractionProps: jest.fn(() => ({
    openExtractAreaModal: jest.fn(),
    isExtractionDisabled: false,
  })),
}))
jest.mock('@/actions/documents', () => ({
  fetchPaginatedEdTable: jest.fn(),
}))
jest.mock('@/utils/localStorageWrapper', () => mockLocalStorageWrapper())
jest.mock('@/utils/env', () => mockEnv)

const { mapDispatchToProps, ConnectedComponent } = TableEdField

describe('Container: TableEdField', () => {
  describe('mapDispatchToProps', () => {
    it('should pass fetchPaginatedEdTable action as fetchPaginatedEdTable prop', () => {
      const { props } = mapDispatchToProps()

      props.fetchPaginatedEdTable()
      expect(fetchPaginatedEdTable).toHaveBeenCalledTimes(1)
    })
  })

  describe('ConnectedComponent', () => {
    let defaultProps, wrapper

    beforeEach(() => {
      jest.clearAllMocks()
      defaultProps = {
        active: false,
        disabled: false,
        dtField: new DocumentTypeField(
          'table',
          'Table',
          null,
          FieldType.TABLE,
          false,
          0,
          'whole',
          2,
        ),
        edField: new ExtractedDataField(
          2,
          new TableData(
            1,
            [{ y: 0 }],
            [{ x: 0 }],
            [new Cell(0, 0, '321')],
            new Rect(0.1, 0.2, 0.3, 0.4),
          ),
        ),
        id: 'table0',
        validation: new FieldValidation(
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
        ),
        fetchPaginatedEdTable: jest.fn(),
        documentId: '1',
      }

      wrapper = shallowWithTheme(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should not call fetchPaginatedEdTable in case of requesting regular table data', () => {
      expect(defaultProps.fetchPaginatedEdTable).not.toBeCalled()
    })

    it('should call fetchPaginatedEdTable in case of requesting paginated table data', () => {
      const meta = {
        rowsChunk: 1,
        listIndex: 0,
        chunksTotal: 10,
        rowsTotal: 150,
      }

      const paginatedEdFieldWithoutCells = new ExtractedDataField(
        1,
        new TableData(
          1,
          [{ y: 0 }],
          [{ x: 0 }],
          [],
          new Rect(0.1, 0.2, 0.3, 0.4),
          null,
          null,
          null,
          null,
          null,
          [{ x: 0 }],
          meta,
        ),
      )
      wrapper.setProps({
        ...defaultProps,
        edField: paginatedEdFieldWithoutCells,
      })
      expect(defaultProps.fetchPaginatedEdTable).toBeCalledTimes(1)
    })

    it('should call localStorage.getItem on mount', () => {
      const meta = {
        rowsChunk: 1,
        listIndex: 0,
        chunksTotal: 10,
        rowsTotal: 150,
      }

      const paginatedEdFieldWithoutCells = new ExtractedDataField(
        1,
        new TableData(
          1,
          [{ y: 0 }],
          [{ x: 0 }],
          [new Cell(0, 0, '321')],
          new Rect(0.1, 0.2, 0.3, 0.4),
          null,
          null,
          null,
          null,
          null,
          [{ x: 0 }],
          meta,
        ),
      )

      wrapper.setProps({
        ...defaultProps,
        edField: paginatedEdFieldWithoutCells,
      })

      expect(localStorageWrapper.getItem).nthCalledWith(1, TABLE_FIELD_PAGINATION)
    })

    it('should save correct pagination to localStorage, in case of changing rowsPerChunk', () => {
      const updatedRowsPerChunk = 45
      const expectedPaginationConfig = {
        [defaultProps.dtField.pk]: updatedRowsPerChunk,
      }

      const meta = {
        rowsChunk: 1,
        listIndex: 0,
        chunksTotal: 10,
        rowsTotal: 150,
      }

      const paginatedEdFieldWithoutCells = new ExtractedDataField(
        1,
        new TableData(
          1,
          [{ y: 0 }],
          [{ x: 0 }],
          [new Cell(0, 0, '321')],
          new Rect(0.1, 0.2, 0.3, 0.4),
          null,
          null,
          null,
          null,
          null,
          [{ x: 0 }],
          meta,
        ),
      )

      wrapper.setProps({
        ...defaultProps,
        edField: paginatedEdFieldWithoutCells,
      })

      const TableField = wrapper.find(ExtractedDataTable).shallow()
      const TableWrapper = TableField.shallow()
      const onPaginationChange = TableWrapper.find(FieldPagination).props().onChange

      onPaginationChange(null, updatedRowsPerChunk)

      expect(localStorageWrapper.setItem).toHaveBeenCalledWith(TABLE_FIELD_PAGINATION, expectedPaginationConfig)
    })

    it('should set predefined pagination to field from localStorage', () => {
      const predefinedChunkSize = 45
      localStorageWrapper.getItem.mockImplementation(() => ({
        [defaultProps.dtField.pk]: predefinedChunkSize,
      }))

      const meta = {
        rowsChunk: 1,
        listIndex: 0,
        chunksTotal: 10,
        rowsTotal: 150,
      }

      const paginatedEdFieldWithoutCells = new ExtractedDataField(
        1,
        new TableData(
          1,
          [{ y: 0 }],
          [{ x: 0 }],
          [new Cell(0, 0, '321')],
          new Rect(0.1, 0.2, 0.3, 0.4),
          null,
          null,
          null,
          null,
          null,
          [{ x: 0 }],
          meta,
        ),
      )

      defaultProps = {
        ...defaultProps,
        edField: paginatedEdFieldWithoutCells,
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)

      const TableField = wrapper.find(ExtractedDataTable).shallow()
      const fieldPaginationProps = TableField.shallow().find(FieldPagination).props()

      expect(fieldPaginationProps.pageSize).toEqual(predefinedChunkSize)
    })

    it('should render correct layout if renderLabel is passed to props', () => {
      const Label = <div />

      defaultProps.renderLabel = jest.fn(() => Label)
      wrapper.setProps(defaultProps)

      expect(wrapper.contains(Label)).toEqual(true)
    })

    it('should not render validation result if field does not have validation errors and warnings', () => {
      defaultProps.validation = new FieldValidation([], [])
      wrapper.setProps(defaultProps)
      expect(wrapper.find(FieldValidationResult).exists()).toBe(false)
    })
  })
})
