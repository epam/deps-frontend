import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { Pagination } from '@/components/Pagination'
import { GoToPageInput } from '@/containers/FieldPagination/GoToPageInput'
import { Localization, localize } from '@/localization/i18n'
import { defaultChunkSize } from '@/models/ExtractedData/TablePagination'
import {
  Text,
  PaginationWrapper,
  Wrapper,
} from './FieldPagination.styles'

const predefinedChunkSizes = [
  defaultChunkSize,
  defaultChunkSize * 2,
  defaultChunkSize * 3,
  defaultChunkSize * 4,
]

const FieldPagination = ({
  current,
  goToPage,
  onChange,
  pageSize,
  showSizeChanger,
  showLessItems,
  total,
}) => {
  const renderTotal = useCallback(() => {
    const from = ((current - 1) * pageSize) + 1
    const to = from + pageSize - 1

    return (
      <Text>
        {
          localize(Localization.PAGINATION_TOTAL, {
            from,
            to: to >= total ? total : to,
            of: total,
          })
        }
      </Text>
    )
  }, [total, current, pageSize])

  return (
    <Wrapper>
      {renderTotal()}
      <PaginationWrapper>
        <Pagination
          current={current}
          onChange={onChange}
          pageSize={pageSize}
          pageSizeOptions={predefinedChunkSizes}
          showLessItems={showLessItems}
          showSizeChanger={showSizeChanger}
          total={total}
        />
        <GoToPageInput
          goToPage={goToPage}
        />
      </PaginationWrapper>
    </Wrapper>
  )
}

FieldPagination.propTypes = {
  onChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  showSizeChanger: PropTypes.bool,
  total: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  goToPage: PropTypes.func.isRequired,
  showLessItems: PropTypes.bool,
}

export { FieldPagination }
