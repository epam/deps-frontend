
import PropTypes from 'prop-types'
import { Empty } from '@/components/Empty'
import { childrenShape } from '@/utils/propTypes'
import { NoDataWrapper } from './NoData.styles'

const TEST_ID = {
  NO_DATA_WRAPPER: 'no-data',
}

const NoData = ({ className, description }) => (
  <NoDataWrapper
    className={className}
    data-testid={TEST_ID.NO_DATA_WRAPPER}
  >
    <Empty
      description={description}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  </NoDataWrapper>
)

NoData.propTypes = {
  description: childrenShape,
  className: PropTypes.string,
}

export {
  NoData,
}
