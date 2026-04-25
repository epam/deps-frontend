
import styled from 'styled-components'
import { Tabs } from '@/components/Tabs'
import { ScreenBreakpoint } from '@/enums/ScreenBreakpoint'

const StyledTabs = styled(Tabs)`
  .ant-tabs-tab:first-child {
    margin-left: 0 !important;
  }
`

const TabWrapper = styled.div`
  margin-top: 1.2rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.color.grayscale21};

  .ant-spin-container {
    grid-template-rows: repeat(6, 1fr);

    @media (min-height: ${ScreenBreakpoint.tablet}) {
      grid-template-rows: repeat(8, 1fr);
    }

    @media (min-height: ${ScreenBreakpoint.tabletL}) {
      grid-template-rows: repeat(12, 1fr);
    }
  }
`

export {
  StyledTabs as Tabs,
  TabWrapper,
}
