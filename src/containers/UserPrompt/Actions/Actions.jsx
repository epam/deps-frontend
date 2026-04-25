
import PropTypes from 'prop-types'
import { FaRotateIcon } from '@/components/Icons/FaRotateIcon'
import { PenIcon } from '@/components/Icons/PenIcon'
import { Localization, localize } from '@/localization/i18n'
import { TEST_ID } from '../constants'
import { ActionIcon, Wrapper } from './Actions.styles'

const Actions = ({
  disabled,
  onEditButtonClick,
  onRetryButtonClick,
}) => (
  <Wrapper>
    {
      onRetryButtonClick ? (
        <ActionIcon
          data-testid={TEST_ID.RETRY_BUTTON}
          disabled={disabled}
          icon={<FaRotateIcon />}
          onClick={onRetryButtonClick}
          tooltip={{ title: localize(Localization.RETRY) }}
        />
      ) : (
        <ActionIcon
          data-testid={TEST_ID.EDIT_BUTTON}
          disabled={disabled}
          icon={<PenIcon />}
          onClick={onEditButtonClick}
          tooltip={{ title: localize(Localization.EDIT) }}
        />
      )
    }
  </Wrapper>
)

Actions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onEditButtonClick: PropTypes.func.isRequired,
  onRetryButtonClick: PropTypes.func,
}

export {
  Actions,
}
