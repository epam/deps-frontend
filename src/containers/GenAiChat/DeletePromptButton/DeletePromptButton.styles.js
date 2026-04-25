
import styled from 'styled-components'
import { MessageActionButton } from '../MessageActionButton'

const StyledMessageActionButton = styled(MessageActionButton)`
  position: absolute;
  top: 0.6rem;
  right: 4rem;
  background-color: ${(props) => props.theme.color.primary3};
    
  &:hover {
    background-color: ${(props) => props.theme.color.primary3};
  }
`

export {
  StyledMessageActionButton as MessageActionButton,
}
