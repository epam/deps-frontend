
import styled from 'styled-components'
import { Tabs } from '@/components/Tabs'

const StyledTabs = styled(Tabs)`
  height: 100%;
  min-height: 0;
    
  .ant-tabs-tab {
    line-height: 2.4rem;
  }

  .ant-tabs-tab:first-child {
    margin-left: 0 !important;
  }

  .ant-tabs-nav {
    margin-bottom: 1.6rem;
  }
`

export {
  StyledTabs as Tabs,
}
