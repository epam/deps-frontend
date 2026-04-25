
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { ArrowDownIcon } from '@/components/Icons/ArrowDownIcon'
import { CustomMenu } from '@/components/Menu/CustomMenu'

const StyledMenu = styled(CustomMenu)`
  padding: 0;
  min-width: 18rem;
  color: ${(props) => props.theme.color.grayscale5};

  .ant-dropdown-menu-item {
    padding: 0;
  }
`

const StyledButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  padding: 0;
  margin-right: 2.5rem;
  color: ${(props) => props.theme.color.grayscale3};
  border: none;
  box-shadow: none;
`

const ProfileMenuOption = styled.div`
  padding: 1rem;
  margin: 0;
  min-width: 23rem;
  &:hover {
    border-left: 2px solid ${(props) => props.theme.color.primary2};
    color: ${(props) => props.theme.color.grayscale5};
    font-weight: bolder;
    & span {
      font-weight: bolder;
    }
  }
`

const DownIcon = styled(ArrowDownIcon)`
  font-size: 1.1rem;
`

export {
  StyledMenu,
  StyledButton,
  DownIcon,
  ProfileMenuOption,
}
