
import styled, { css } from 'styled-components'
import { ErrorTriangleIcon } from '@/components/Icons/ErrorTriangleIcon'
import { FileAltIcon } from '@/components/Icons/FileAltIcon'
import { Menu } from '@/components/Menu'
import { Tag } from '@/components/Tag'

const FilesIcon = styled(FileAltIcon)`
  color: ${(props) => props.theme.color.grayscale12};
  margin-right: 0.8rem;

  ${(props) => props.$hasErrors && css`
    color: ${props.theme.color.error};
  `}
`

const StyledTag = styled(Tag)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 6.5rem;
  color: ${(props) => props.theme.color.grayscale12};
  background: ${(props) => props.theme.color.grayscale20};
  border: 1px solid ${(props) => props.theme.color.grayscale1};

  &:hover {
    border: 1px solid ${(props) =>
      props.$hasErrors
      ? props.theme.color.error
      : props.theme.color.grayscale12};
  }

  ${(props) => props.$hasErrors && css`
    color: ${props.theme.color.error};
    background: ${props.theme.color.errorBg};
    border: 1px solid ${props.theme.color.errorLight};
  `}
`

export const WarningIcon = styled(ErrorTriangleIcon)`
  color: ${(props) => props.theme.color.warning};
  cursor: pointer;
`

const MenuItem = styled(Menu.Item)`
  outline: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.4rem;
  padding: 0;
`

const MenuItemContent = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 30rem;
  align-items: center;
  justify-content: space-between;
  line-height: 2.2rem;
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.grayscale18};
  padding: 0.8rem 1.2rem;
  border-radius: 0.4rem;
`

const StyledMenu = styled(Menu)`
  padding: 0;
  outline: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.4rem;
`

export {
  StyledTag as Tag,
  StyledMenu as Menu,
  FilesIcon,
  MenuItemContent,
  MenuItem,
}
