
import PropTypes from 'prop-types'
import { userShape } from '@/models/User'
import { waitingForApprovalUserShape } from '@/models/WaitingForApprovalUser'
import {
  FullNameBlock,
  UserHeadline,
  StyledAvatar,
  OrganisationName,
  StyledUserCard,
} from './UserCard.styles'

const UserCard = ({ user }) => {
  const getFirstChar = (name) => name?.[0] ?? ''

  const getAvatarCharacters = () => {
    const firstNameChar = getFirstChar(user.firstName)
    const lastNameChar = getFirstChar(user.lastName)
    return `${firstNameChar}${lastNameChar}`
  }

  const getUserCaption = () => `${user.firstName ?? ''} ${user.lastName ?? ''}`

  return (
    <StyledUserCard>
      <StyledAvatar>
        {getAvatarCharacters()}
      </StyledAvatar>
      <UserHeadline>
        {
          (user.firstName || user.lastName) &&
          (
            <FullNameBlock>
              {getUserCaption()}
            </FullNameBlock>
          )
        }
        <OrganisationName>
          {user.organisation?.name ?? user.email}
        </OrganisationName>
      </UserHeadline>
    </StyledUserCard>
  )
}

UserCard.propTypes = {
  user: PropTypes.oneOfType([
    userShape,
    waitingForApprovalUserShape,
  ]),
}

export { UserCard }
