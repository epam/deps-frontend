
import styled from 'styled-components'
import { Tabs } from '@/components/Tabs'

const Extra = styled.div`
  display: grid;
  margin: 0 0.6rem;
  align-items: center;
  grid-auto-flow: column;
  grid-gap: 0.6rem;
  position: sticky;
  right: 0;
  top: 0;
`

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav:before {
    display: none;
  }
`

const Separator = styled.div`
  height: 1.6rem;
  width: 1px;
  background-color: ${(props) => props.theme.color.grayscale1Darker};
`

const SpinWrapper = styled.div`
  margin-top: 1.6rem;
`

export {
  Extra,
  Separator,
  SpinWrapper,
  StyledTabs as Tabs,
}
