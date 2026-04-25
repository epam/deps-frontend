
import PropTypes from 'prop-types'
import { ApproveSelectedUsersButton } from '@/containers/ApproveSelectedUsersButton'
import { ApproveUserButton } from '@/containers/ApproveUserButton'
import { RemoveWaitingUserButton } from '@/containers/RemoveWaitingUserButton'
import { waitingForApprovalUserShape } from '@/models/WaitingForApprovalUser'
import { Wrapper } from './WaitingForApprovalTableCommands.styles'

const WaitingForApprovalTableCommands = ({
  user,
  className,
}) => (
  <Wrapper className={className}>
    <RemoveWaitingUserButton
      waitingUser={user}
    />
    {
      user
        ? <ApproveUserButton waitingUser={user} />
        : <ApproveSelectedUsersButton />
    }
  </Wrapper>
)

WaitingForApprovalTableCommands.propTypes = {
  user: waitingForApprovalUserShape,
  className: PropTypes.string,
}

export {
  WaitingForApprovalTableCommands,
}
