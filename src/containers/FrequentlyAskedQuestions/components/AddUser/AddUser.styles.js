
import styled from 'styled-components'
import addUserButtonImage from '@/assets/images/addUserButton.png'
import enterEmailImage from '@/assets/images/enterEmail.png'
import inviteToTheOrganizationImage from '@/assets/images/inviteToTheOrganization.png'
import sendInviteImage from '@/assets/images/sendInvite.png'
import { LargeImage, SmallSideImage, LargeSideImage } from '@/containers/FrequentlyAskedQuestions/components/Image.styles'

const StyledAddUserButtonImage = styled(LargeSideImage)`
  background-image: url(${addUserButtonImage});  
`

const StyledEnterEmailImage = styled(LargeImage)`
  background-image: url(${enterEmailImage});  
  height: 15rem;
`

const StyledInviteToTheOrganizationImage = styled(SmallSideImage)`
  background-image: url(${inviteToTheOrganizationImage});
`

const StyledSendInviteImage = styled(LargeImage)`
  background-image: url(${sendInviteImage});
  height: 15rem;
`

export {
  StyledAddUserButtonImage as AddUserButtonImage,
  StyledEnterEmailImage as EnterEmailImage,
  StyledInviteToTheOrganizationImage as InviteToTheOrganizationImage,
  StyledSendInviteImage as SendInviteImage,
}
