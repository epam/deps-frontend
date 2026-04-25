
import PropTypes from 'prop-types'
import { ComponentSize } from '@/enums/ComponentSize'
import {
  HorizontalSpin,
  VerticalSpin,
  InfiniteLoadWrapper,
} from './HandsonTable.styles'

const FETCH_ROWS_THRESHOLD = 10
const FETCH_COLUMNS_THRESHOLD = 10
const FETCH_SIZE = 40

const withInfiniteLoad = (Table) => {
  const Wrapper = ({
    fetchMoreData,
    rowCount,
    columnCount,
    areRowsLoading,
    areColumnsLoading,
    rowsThreshold = FETCH_ROWS_THRESHOLD,
    columnThreshold = FETCH_COLUMNS_THRESHOLD,
    fetchSize = FETCH_SIZE,
    ...restProps
  }) => {
    const afterScrollVertically = (htRef) => {
      const hotInstance = htRef.current.hotInstance
      const firstVisibleRow = hotInstance.view.wt.wtTable.getFirstVisibleRow()
      const visibleRows = hotInstance.countVisibleRows()
      const loadedRows = hotInstance.countRows()
      const lastVisibleRow = firstVisibleRow + visibleRows - 1
      const shouldLoadMoreRows = rowCount - loadedRows > 0
      const bufferRows = loadedRows - lastVisibleRow

      if (shouldLoadMoreRows && bufferRows <= rowsThreshold) {
        const rowSpan = [loadedRows, loadedRows + fetchSize]
        fetchMoreData({ rowSpan })
      }
    }

    const afterScrollHorizontally = (htRef) => {
      const hotInstance = htRef.current.hotInstance
      const firstVisibleColumn = hotInstance.view.wt.wtTable.getFirstVisibleColumn()
      const visibleColumns = hotInstance.countVisibleCols()
      const loadedColumns = hotInstance.countCols()
      const lastVisibleColumn = firstVisibleColumn + visibleColumns - 1
      const shouldLoadMoreColumns = columnCount - loadedColumns > 0
      const bufferColumns = loadedColumns - lastVisibleColumn

      if (shouldLoadMoreColumns && bufferColumns <= columnThreshold) {
        const colSpan = [loadedColumns, loadedColumns + fetchSize]
        fetchMoreData({ colSpan })
      }
    }

    return (
      <InfiniteLoadWrapper>
        <Table
          afterScrollHorizontally={afterScrollHorizontally}
          afterScrollVertically={afterScrollVertically}
          readOnly
          {...restProps}
        />
        {
          areRowsLoading && (
            <HorizontalSpin
              size={ComponentSize.LARGE}
              spinning={areRowsLoading}
            />
          )
        }
        {
          areColumnsLoading && (
            <VerticalSpin
              size={ComponentSize.LARGE}
              spinning={areColumnsLoading}
            />
          )
        }
      </InfiniteLoadWrapper>
    )
  }

  Wrapper.propTypes = {
    fetchMoreData: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
    columnCount: PropTypes.number.isRequired,
    areRowsLoading: PropTypes.bool.isRequired,
    areColumnsLoading: PropTypes.bool.isRequired,
    rowsThreshold: PropTypes.number,
    columnThreshold: PropTypes.number,
    fetchSize: PropTypes.number,
  }

  return Wrapper
}

export {
  withInfiniteLoad,
}
