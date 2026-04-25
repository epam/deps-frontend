
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { CustomCollapse } from '@/components/Collapse/CustomCollapse'
import { List } from '@/components/List'
import { LongText } from '@/components/LongText'

const StyledCollapse = styled(CustomCollapse)`
  width: 100%;
`

const StyledPanel = styled(CustomCollapse.Panel)`
  margin-bottom: 1.6rem;
  width: 100%;

  .ant-collapse-header {
    color: ${(props) => props.theme.color.grayscale18} !important;
    font-weight: ${({ $isActive }) => $isActive ? 600 : 400};
    padding: 0 !important;
    width: 100%;
  }

  .ant-collapse-header-text {
    width: 90%;
    word-wrap: break-word;
  }

  .ant-collapse-content-box {
    padding: 0 !important;
  }
`

const StyledIconButton = styled(Button.Icon)`
  cursor: pointer;
  height: 2.4rem;
  width: 2.4rem;
  
  & path {
    fill: ${(props) => props.theme.color.grayscale12};
  }

  &,
  :hover,
  :active,
  :focus {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
`

const StyledList = styled(List)`
  padding-top: 1.6rem;
`

const DocumentTitle = styled(LongText)`
  max-width: 80%;
`

export {
  StyledCollapse as Collapse,
  StyledPanel as Panel,
  StyledList as List,
  StyledIconButton as ExpandIcon,
  DocumentTitle,
}
