
import PropTypes from 'prop-types'
import { ArrowRotateLeftIcon } from '@/components/Icons/ArrowRotateLeftIcon'
import { CircleInfoIcon } from '@/components/Icons/CircleInfoIcon'
import { SpinnerIcon } from '@/components/Icons/SpinnerIcon'
import { WarningTriangleIcon } from '@/components/Icons/WarningTriangleIcon'
import { Tooltip } from '@/components/Tooltip'
import { OutputState } from '@/enums/OutputState'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { ProfileStatus } from '../enums/ProfileStatus'
import {
  WarningMessage,
  InfoWrapper,
  IconButton,
  WarningText,
  IconWrapper,
  InfoMessage,
} from './OutputNotification.styles'

const NotificationText = {
  [ProfileStatus.OUTDATED]: localize(Localization.OUTPUT_OUT_OF_DATE),
  [ProfileStatus.DELETED]: localize(Localization.OUTPUT_PROFILE_WAS_DELETED),
}

const TooltipText = {
  [ProfileStatus.OUTDATED]: localize(Localization.OUTPUT_VERSION_OUT_OF_DATE),
  [ProfileStatus.DELETED]: localize(Localization.ASSOCIATED_PROFILE_DELETED),
}

const TooltipConfig = {
  placement: Placement.TOP_RIGHT,
  title: localize(Localization.REGENERATE_OUTPUT),
}

const OutputNotification = ({
  onClick,
  profileStatus,
  state,
}) => {
  if (state === OutputState.PENDING) {
    return (
      <InfoMessage>
        <IconWrapper>
          <SpinnerIcon />
        </IconWrapper>
        {localize(Localization.OUTPUT_PENDING)}
      </InfoMessage>
    )
  }

  return (
    <WarningMessage>
      <InfoWrapper profileStatus={profileStatus}>
        <WarningTriangleIcon />
        <WarningText>
          {NotificationText[profileStatus]}
        </WarningText>
        <Tooltip
          getPopupContainer={(trigger) => trigger.parentNode}
          placement={Placement.TOP_LEFT}
          title={TooltipText[profileStatus]}
        >
          <CircleInfoIcon />
        </Tooltip>
      </InfoWrapper>
      {
        profileStatus === ProfileStatus.OUTDATED && (
          <IconButton
            icon={<ArrowRotateLeftIcon />}
            onClick={onClick}
            tooltip={TooltipConfig}
          />
        )
      }
    </WarningMessage>
  )
}

OutputNotification.propTypes = {
  onClick: PropTypes.func,
  profileStatus: PropTypes.oneOf(
    Object.values(ProfileStatus),
  ),
  state: PropTypes.oneOf(
    Object.values(OutputState),
  ),
}

export {
  OutputNotification,
}
