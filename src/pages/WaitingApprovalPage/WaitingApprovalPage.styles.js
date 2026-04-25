
import styled from 'styled-components'
import waitingApprovalPic from '@/assets/images/waitingApproval.png'
import { Menu } from '@/components/Menu'

const WaitingApprovalPageWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => props.theme.color.primary5};
`

const Title = styled.p`
  margin-top: 5rem;
  line-height: 75%;
  text-align: center;
  font-weight: 700;
  font-size: 3.6rem;
  color: ${(props) => props.theme.color.grayscale5};
  white-space: pre-line;
`

const Image = styled.div`
  width: 37rem;
  height: 32rem;
  margin: 5rem 0;
  background-image: url(${waitingApprovalPic});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
`
const Header = styled.header`
  padding: 0.8rem 1.6rem 0.8rem 1.2rem;
  width: 100%;
  background: ${(props) => props.theme.color.primary3};
  box-shadow: 0 0.3rem 1.9rem ${(props) => props.theme.color.grayscale1};
`

const StyledMenu = styled(Menu)`
  max-height: 250px;
  overflow: auto;
`

export {
  WaitingApprovalPageWrapper,
  Title,
  Image,
  Header,
  StyledMenu,
}
