
import styled from 'styled-components'
import { Tabs } from '@/components/Tabs'
import { theme } from '@/theme/theme.default'

const HelpWrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 1.6rem;
  overflow-y: scroll;
  background-color: ${theme.color.primary5};  
`

const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin: 1rem 1rem 1rem 0 !important;
  }
`

export {
  HelpWrapper,
  StyledTabs as Tabs,
}
