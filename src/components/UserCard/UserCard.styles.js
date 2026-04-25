
import styled from 'styled-components'
import { Avatar } from '@/components/Avatar'

const StyledUserCard = styled.div`
  display: flex;
  align-items: center;
`

const FullNameBlock = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.5rem;
  font-weight: 400;
`

const UserHeadline = styled.div`
  display: flex;
  flex-direction: column;
  height: 3rem;
  padding: 0 1rem;
`

const StyledAvatar = styled(Avatar)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 3rem;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
`

const OrganisationName = styled.div`
  line-height: 1.5rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.color.primary2};
`

export {
  StyledAvatar,
  FullNameBlock,
  UserHeadline,
  OrganisationName,
  StyledUserCard,
}
