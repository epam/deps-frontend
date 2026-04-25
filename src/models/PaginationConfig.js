
import PropTypes from 'prop-types'
import { PaginationKeys } from '@/constants/navigation'
import { defaultShowTotal } from '@/utils/tableUtils'

const DefaultPagination = {
  PER_PAGE: 20,
  PAGE: 1,
}

const DefaultPaginationConfig = {
  [PaginationKeys.PAGE]: DefaultPagination.PAGE,
  [PaginationKeys.PER_PAGE]: DefaultPagination.PER_PAGE,
}

class PaginationConfig {
  constructor ({
    current = 1,
    pageSize = DefaultPagination.PER_PAGE,
    total = 0,
    showSizeChanger = !!total,
    showTotal = defaultShowTotal,
  } = {}) {
    this.current = current
    this.pageSize = pageSize
    this.total = total
    this.showSizeChanger = showSizeChanger
    this.showTotal = showTotal
  }
}

const paginationConfigShape = PropTypes.shape({
  current: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  onChange: PropTypes.func,
  onShowSizeChange: PropTypes.func,
  showSizeChanger: PropTypes.bool,
  showTotal: PropTypes.func,
})

export {
  PaginationConfig,
  paginationConfigShape,
  DefaultPaginationConfig,
}
