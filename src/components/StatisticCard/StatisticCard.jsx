
import PropTypes from 'prop-types'
import { Spin } from '@/components/Spin'
import { Placement } from '@/enums/Placement'
import { theme } from '@/theme/theme.default'
import {
  CardInfoWrapper,
  CardTitle,
  CardValuesWrapper,
  CardWrapper,
  CurrentValueWrapper,
  TotalValueWrapper,
  Progress,
} from './StatisticCard.styles'

const PROGRESS_BAR_STATUS = 'normal'
const PROGRESS_BAR_TYPE = 'circle'
const PROGRESS_BAR_WIDTH = 55
const PROGRESS_BAR_STROKE_WIDTH = 3

const getProgressPercent = (current, total) => Math.floor(current / total * 100)

const StatisticCard = ({
  title,
  currentValue,
  totalValue,
  renderExtra,
  isLoading,
}) => (
  <CardWrapper>
    <Spin spinning={isLoading}>
      <Progress
        gapPosition={Placement.TOP}
        percent={getProgressPercent(currentValue, totalValue)}
        status={PROGRESS_BAR_STATUS}
        strokeWidth={PROGRESS_BAR_STROKE_WIDTH}
        trailColor={theme.color.grayscale17}
        type={PROGRESS_BAR_TYPE}
        width={PROGRESS_BAR_WIDTH}
      />
      <CardInfoWrapper>
        <CardTitle>
          {title}
        </CardTitle>
        <CardValuesWrapper>
          <CurrentValueWrapper>
            {currentValue}
          </CurrentValueWrapper>
          /
          <TotalValueWrapper>
            {totalValue}
          </TotalValueWrapper>
        </CardValuesWrapper>
      </CardInfoWrapper>
      {renderExtra?.()}
    </Spin>
  </CardWrapper>
)

StatisticCard.propTypes = {
  currentValue: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  totalValue: PropTypes.number.isRequired,
  renderExtra: PropTypes.func,
  isLoading: PropTypes.bool,
}

export {
  StatisticCard,
}
