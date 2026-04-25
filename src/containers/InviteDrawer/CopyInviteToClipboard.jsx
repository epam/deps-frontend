
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { connect } from 'react-redux'
import { Button } from '@/components/Button'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { navigationMap } from '@/utils/navigationMap'
import { notifySuccess } from '@/utils/notification'
import { InviteLinkWrapper, StyledSpan } from './InviteDrawer.styles'

const CopyInviteToClipboard = ({ onClose, user }) => {
  const getJoinUrl = useCallback(() => {
    return window.location.origin + navigationMap.join() + `/${user.organisation.pk}`
  }, [user.organisation.pk])

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(getJoinUrl())
    notifySuccess(localize(Localization.COPIED_TO_CLIPBOARD_SUCCESS))
    onClose()
  }, [
    onClose,
    getJoinUrl,
  ])

  return (
    <InviteLinkWrapper>
      <StyledSpan>{getJoinUrl()}</StyledSpan>
      <Button.Secondary
        onClick={copyToClipboard}
      >
        {localize(Localization.COPY_LINK)}
      </Button.Secondary>
    </InviteLinkWrapper>
  )
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

CopyInviteToClipboard.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: userShape.isRequired,
}

const ConnectedComponent = connect(mapStateToProps)(CopyInviteToClipboard)

export {
  ConnectedComponent as CopyInviteToClipboard,
}
