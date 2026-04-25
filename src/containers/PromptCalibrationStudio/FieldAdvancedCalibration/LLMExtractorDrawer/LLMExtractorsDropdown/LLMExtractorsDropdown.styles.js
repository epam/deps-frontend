
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { AngleDownIcon } from '@/components/Icons/AngleDownIcon'
import { LongText } from '@/components/LongText'
import { Menu } from '@/components/Menu'
import { SearchInput } from '@/containers/SearchInput'

export const ArrowIcon = styled(AngleDownIcon)`
  flex-shrink: 0;
  transition: all 0.3s ease-in;

  ${({ $isOpen }) => $isOpen && css`
    transform: rotate(180deg);
  `}
`

export const DropdownMenu = styled(Menu)`
  padding: 0;
  width: 28rem;
`

export const MenuItem = styled(Menu.Item)`
  padding: 0;
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};

  && {
    background-color: ${({ theme, $isSelected }) => (
      $isSelected ? theme.color.grayscale8 : 'transparent'
    )};
  }

  &&:hover {
    background-color: ${(props) => props.theme.color.grayscale8};
  }

  & .ant-dropdown-menu-title-content {
    width: 100%;
  }
`

export const StyledSearchInput = styled(SearchInput)`
  border: none;
`

export const TriggerButton = styled(Button.Text)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: auto;
  max-width: 75%;
  color: ${(props) => props.theme.color.grayscale18};
  background-color: transparent;
  cursor: pointer;

  &&:hover,
  &&:focus {
    background-color: transparent;
    color: ${(props) => props.theme.color.primary2};
  }
`

export const TextButton = styled(Button.Text)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${(props) => props.theme.color.primary2};

  &:hover {
    color: ${(props) => props.theme.color.primary2};
  }
`

export const StyledLongText = styled(LongText)`
  padding: 0.5rem 1rem;
  color: ${(props) => props.theme.color.grayscale18};
`

export const ItemsWrapper = styled.div`
  max-height: 23rem;
  overflow-y: auto;

  &:hover {
    background-color: transparent;
  }
`
