
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { CommandBar } from '@/components/CommandBar'

const StyledIconButton = styled(Button.Icon)`
  width: 3.2rem;
  height: 3.2rem;
  color: ${(props) => props.theme.color.primary2};
  transition: all 0.3s cubic-bezier(0.645,0.045,0.355,1);
`

const DownloadButton = styled(StyledIconButton)`
  background-color: ${(props) => props.theme.color.primary2};
  color: ${(props) => props.theme.color.primary3};

  &:hover {
    background-color: ${(props) => props.theme.color.primary2};
  }

  &:disabled {
    background-color: ${(props) => props.theme.color.grayscale22};
    border-color: transparent;
  }
`

const StyledCommandBar = styled(CommandBar)`
  flex-basis: 27%;
  justify-content: space-between;
`

export {
  StyledIconButton as IconButton,
  StyledCommandBar as CommandBar,
  DownloadButton,
}
