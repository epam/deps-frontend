
import styled from 'styled-components'
import { Button } from '@/components/Button'

const ButtonIcon = styled(Button.Icon)`
  position: absolute;
  z-index: 2;
  right: 2px;
  top: -15px;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 2.8rem;
  margin-left: 1rem;
  border: 1px solid ${(props) => props.theme.color.grayscale19};
  background-color: ${(props) => props.theme.color.grayscale14};

  path {
    fill: ${(props) => props.theme.color.primary2};
  }
`

export {
  ButtonIcon,
}
