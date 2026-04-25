
import styled from 'styled-components'
import { CircleInfoIcon } from '@/components/Icons/CircleInfoIcon'
import { Menu } from '@/components/Menu'

const MenuItem = styled(Menu.Item)`
  cursor: default;
  background-color: ${(props) => props.theme.color.grayscale14};
  padding: 1.2rem 1.6rem !important;
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};

  .ant-dropdown-menu-title-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

const Trigger = styled.div`
  position: relative;
  
  &.ant-dropdown-open > .ant-btn {
    border-color: ${(props) => props.theme.color.grayscale21};
    background-color: ${(props) => props.theme.color.grayscale21};
  }
`

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.color.grayscale11};
  font-size: 1.2rem;
  padding: 0.8rem;
  white-space: break-spaces;
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
`

const DropdownMenu = styled(Menu)`
  padding: 0;
  width: 28rem;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  box-shadow: 0 0.3rem 1.8rem 0 ${(props) => props.theme.color.shadow3};
`

const InfoIcon = styled(CircleInfoIcon)`
  font-size: 2rem;
  margin-right: 0.8rem;
`

export {
  MenuItem,
  Trigger,
  InfoWrapper,
  DropdownMenu,
  InfoIcon,
}
