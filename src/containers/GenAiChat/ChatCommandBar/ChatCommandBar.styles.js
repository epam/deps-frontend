
import styled from 'styled-components'
import { Button } from '@/components/Button'

const StyledIconButton = styled(Button.Icon)`
  width: 3.2rem;
  height: 3.2rem;
  margin-left: 1rem;
  color: ${(props) => props.theme.color.primary2};
  border: 1px solid ${(props) => props.theme.color.primary2};

  &:disabled {
    border: 1px solid ${(props) => props.theme.color.grayscale4};
  }
`

export {
  StyledIconButton as IconButton,
}
