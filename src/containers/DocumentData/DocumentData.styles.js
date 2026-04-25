
import styled from 'styled-components'
import { Tabs } from '@/components/Tabs'

const StyledTabs = styled(Tabs)`
  flex: 0 0 auto;
  padding: 0 0 0.5rem 0 !important;
  height: 100%;

  .ant-tabs-content-holder {
    padding-top: 1rem;
  }
`

export {
  StyledTabs as Tabs,
}
