
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { CustomCollapse } from '@/components/Collapse/CustomCollapse'
import { SettingsIcon } from '@/components/Icons/SettingsIcon'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'

const StyledCollapse = styled(CustomCollapse)`
  width: 20rem;
  background-color: ${(props) => props.theme.color.primary3} !important;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  box-shadow: 0 0.3rem 1.9rem 0 ${(props) => props.theme.color.shadow3};
`

const StyledPanel = styled(CustomCollapse.Panel)`
  width: 100%;
  border-top: 1px solid ${(props) => props.theme.color.grayscale15};
  cursor: pointer;

  .ant-collapse-header {
    padding: 0 !important;
  }
  
  .ant-collapse-content-box {
    padding: 0 !important;
  }
`

const StyledIconButton = styled(Button.Icon)`
  width: 2.4rem;
  height: 2.4rem;
  cursor: pointer;

  &,
  :hover,
  :active,
  :focus {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
`

const CloseIcon = styled(XMarkIcon)`
  color: ${(props) => props.theme.color.blueDark};
`

const ExpandIcon = styled(SettingsIcon)`
  color: ${(props) => props.theme.color.grayscale12};
`

const ItemWrapper = styled.div`
  padding: 0.8rem 3.2rem 0.8rem 1.2rem;
  width: 100%;
`

const Model = styled.div`
  padding: 1px 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2rem;
  color: ${({ $isActive, theme }) => $isActive ? theme.color.blueDark : theme.color.grayscale18};
`

const Provider = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.2rem;
  color: ${({ $isActive, theme }) => $isActive ? theme.color.blueDark : theme.color.grayscale12};
`

export {
  CloseIcon,
  ExpandIcon,
  ItemWrapper,
  Model,
  Provider,
  StyledIconButton,
  StyledCollapse as Collapse,
  StyledPanel as Panel,
}
