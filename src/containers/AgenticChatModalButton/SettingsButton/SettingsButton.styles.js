
import styled from 'styled-components'
import { Button } from '@/components/Button'

const StyledButton = styled(Button)`
  height: 2.4rem;
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 0;
  border: none;
  box-shadow: none;
  color: ${({ $isActive, theme }) => $isActive ? theme.color.blueDark : theme.color.grayscale12};
  font-weight: 400;
  font-size: 1.2rem;
  line-height: 2.2rem;

  &:disabled {
    color: ${(props) => props.theme.color.grayscale22};
  }
  
  &:hover,
  &:active,
  &:focus {
    color: ${({ $isActive, theme }) => $isActive ? theme.color.blueDark : theme.color.grayscale12};
  }
  
  > svg {
    transition: transform 0.2s;
    transform: ${({ $isActive }) => ($isActive ? 'rotate(180deg)' : 'none')};
  }
`

export {
  StyledButton as Button,
}
