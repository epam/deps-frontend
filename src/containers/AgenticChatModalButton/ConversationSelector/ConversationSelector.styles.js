
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { CommentsIcon } from '@/components/Icons/CommentsIcon'
import { LongText } from '@/components/LongText'
import { Menu } from '@/components/Menu'
import { SettingsButton } from '@/containers/AgenticChatModalButton/SettingsButton'

const DropdownTrigger = styled(SettingsButton)`
  color: ${({ $isActive, theme }) => $isActive ? theme.color.blueDark : theme.color.grayscale18};
  font-weight: 400;
  font-size: 1.4rem;
  gap: 0.8rem;
  background-color: ${({ theme }) => theme.color.grayscale14};

  &:hover,
  &:active,
  &:focus {
    background-color: ${({ theme }) => theme.color.grayscale14};
  }
`

const StyledMenu = styled(Menu)`
  max-height: 32rem;
  overflow-y: auto;
  min-width: 20rem;
`

const StyledMenuItem = styled(Menu.Item)`
  padding: 1.2rem 1.6rem;

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.color.grayscale8};
  }

  ${({ $isActive }) => $isActive && css`
      background-color: ${({ theme }) => theme.color.grayscale20};
  `}
`

const ItemTitle = styled(LongText)`
  max-width: 15rem;
`

const ConversationsIcon = styled(CommentsIcon)`
  path {
    fill: ${({ theme }) => theme.color.primary2};
  }
`

const ConversationsButtonIcon = styled(Button.Icon)`
  width: 2.4rem;
  height: 2.4rem;
`

export {
  DropdownTrigger,
  StyledMenu,
  StyledMenuItem,
  ItemTitle,
  ConversationsButtonIcon,
  ConversationsIcon,
}
