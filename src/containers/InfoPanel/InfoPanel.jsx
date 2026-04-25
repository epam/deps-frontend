
import PropTypes from 'prop-types'
import { Spin } from '@/components/Spin'
import { Localization, localize } from '@/localization/i18n'
import {
  Total,
  TotalNumberWrapper,
  Wrapper,
} from './InfoPanel.styles'

const InfoPanel = ({
  total,
  renderActions,
  fetching,
  className,
}) => (
  <Wrapper className={className}>
    <TotalNumberWrapper>
      {localize(Localization.TOTAL_NUMBER)}
      <Total>
        {
          fetching
            ? <Spin spinning />
            : total
        }
      </Total>
    </TotalNumberWrapper>
    {renderActions?.()}
  </Wrapper>
)

InfoPanel.propTypes = {
  className: PropTypes.string,
  fetching: PropTypes.bool,
  renderActions: PropTypes.func,
  total: PropTypes.number.isRequired,
}

export {
  InfoPanel,
}
