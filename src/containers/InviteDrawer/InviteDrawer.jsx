
import PropTypes from 'prop-types'
import { Drawer } from '@/components/Drawer'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { CopyInviteToClipboard } from './CopyInviteToClipboard'
import { InviteByEmail } from './InviteByEmail'
import { StyledTitle, TextDivider } from './InviteDrawer.styles'

const TITLE = <StyledTitle>{localize(Localization.INVITE_TITLE)}</StyledTitle>
const DRAWER_PUSH_DISTANCE = { distance: 50 }

const InviteDrawer = ({ visible, onClose, refetchUsers }) => (
  <Drawer
    hasCloseIcon={false}
    onClose={onClose}
    open={visible}
    placement={Placement.RIGHT}
    push={DRAWER_PUSH_DISTANCE}
    title={TITLE}
  >
    {
      ENV.FEATURE_INVITE_BY_MAIL && (
        <InviteByEmail
          onClose={onClose}
          refetchUsers={refetchUsers}
        />
      )
    }
    {
      ENV.FEATURE_COPY_INVITE && (
        <>
          {ENV.FEATURE_INVITE_BY_MAIL && <TextDivider>{localize(Localization.OR)}</TextDivider>}
          <CopyInviteToClipboard
            onClose={onClose}
          />
        </>
      )
    }
  </Drawer>
)

InviteDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchUsers: PropTypes.func.isRequired,
}

export {
  InviteDrawer,
}
