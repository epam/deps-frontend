
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { Menu } from '@/components/Menu'

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
`

const DropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2.2rem;
  gap: 0.5rem;
  cursor: pointer;

  ${({ $isActive }) => $isActive && css`
    color: ${({ theme }) => theme.color.primary7};
  `}

  &:hover {
    color: ${({ theme }) => theme.color.primary7};
  }
`

const EditLink = styled(Button)`
  display: flex;
  justify-content: flex-start;
  color: ${({ theme }) => theme.color.primary1};
  padding: 0;
  font-size: 1.2rem;
  line-height: 1.6rem;

  &:disabled {
    color: ${({ theme }) => theme.color.grayscale11};
  }
`

const StyledMenu = styled(Menu)`
  outline: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 0.4rem;
  padding: 0;
`

const StyledMenuItem = styled(Menu.Item)`
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};
  padding: 0.8rem 1.2rem;
`

export {
  SelectContainer,
  DropdownTrigger,
  EditLink,
  StyledMenu,
  StyledMenuItem,
}
