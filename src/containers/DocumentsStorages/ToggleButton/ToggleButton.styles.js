
import styled from 'styled-components'
import { Button } from '@/components/Button'

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
`

const StyledButton = styled(Button)`
  border: none;
  box-shadow: none;

  &.ant-btn-ghost:hover {
    background-color: ${(props) => props.theme.color.primary3};
  }

  &::after {
    all: unset;
  }
`

export {
  ButtonWrapper,
  StyledButton as Button,
}
