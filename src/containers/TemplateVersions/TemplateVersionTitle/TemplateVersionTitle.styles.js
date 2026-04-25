
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { CommandBar } from '@/components/CommandBar'

const IconButton = styled(Button.Icon)`
  width: 2.4rem;
  height: 2.4rem;
  color: ${(props) => props.theme.color.primary2};

  &:active,
  &:focus {
    border: none;
  }
`

const StyledCommandBar = styled(CommandBar)`
  justify-content: end;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  > span {
    width: 100%;
  }
`

export {
  IconButton,
  StyledCommandBar as CommandBar,
  TitleWrapper,
}
