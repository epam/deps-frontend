
import styled from 'styled-components'
import { Button } from '@/components/Button'

const IconButton = styled(Button.Icon)`
  padding: 0.8rem;
  border: 1px solid ${(props) => props.theme.color.primary2};
  border-radius: 4px;

  &:hover {
    background-color: transparent;
  }
`

export {
  IconButton,
}
