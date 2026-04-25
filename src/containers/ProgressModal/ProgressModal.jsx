
import PropTypes from 'prop-types'
import { CircleExclamationIcon } from '@/components/Icons/CircleExclamationIcon'
import { SpinnerIcon } from '@/components/Icons/SpinnerIcon'
import { Localization, localize } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import {
  Counter,
  CountersWrapper,
  IconWrapper,
  NotificationMessage,
  NotificationTitle,
  StyledModal,
  StyledProgress,
  Wrapper,
} from './ProgressModal.styles'

const getProgressPercent = (current, total) => Math.floor(current / total * 100)

const MODAL_WIDTH = '40rem'
const MODAL_Z_INDEX = 1010
const PROGRESS_TEST_ID = 'progress-id'

export const ProgressModal = ({
  title,
  total,
  current,
}) => (
  <StyledModal
    centered
    closable={false}
    closeIcon={false}
    destroyOnClose
    footer={null}
    maskClosable={false}
    open
    title={title || localize(Localization.UPLOAD_FILES)}
    width={MODAL_WIDTH}
    zIndex={MODAL_Z_INDEX}
  >
    <Wrapper>
      <IconWrapper>
        <SpinnerIcon />
      </IconWrapper>
      <NotificationTitle>
        <CircleExclamationIcon />
        {localize(Localization.DO_NOT_CLOSE_PAGE)}
      </NotificationTitle>
      <NotificationMessage>
        {localize(Localization.PROGRESS_NOTIFICATION_MESSAGE)}
      </NotificationMessage>
      <CountersWrapper>
        <Counter>
          {
            localize(Localization.VALUE_OF_TOTAL, {
              value: current,
              total,
            })
          }
        </Counter>
        <Counter>
          {getProgressPercent(current, total)}
          %
        </Counter>
      </CountersWrapper>
      <StyledProgress
        data-testid={PROGRESS_TEST_ID}
        percent={getProgressPercent(current, total)}
        showInfo={false}
        strokeColor={theme.color.success}
        trailColor={theme.color.grayscale17}
      />
    </Wrapper>
  </StyledModal>
)

ProgressModal.propTypes = {
  title: PropTypes.string,
  total: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
}
