
import styled from 'styled-components'
import { Button } from '@/components/Button'

const ToggleDrawerButton = styled(Button)`
  display: flex;
  align-items: center;
  height: 3.2rem;
  border-radius: 4px;
  font-size: 1.4rem;
  font-weight: 600;
  background-color: ${(props) => props.theme.color.grayscale14};
  color: ${(props) => props.theme.color.grayscale18};
  margin-right: 1.2rem;
`

export {
  ToggleDrawerButton,
}
