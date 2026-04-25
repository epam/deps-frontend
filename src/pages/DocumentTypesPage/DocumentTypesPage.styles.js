
import styled from 'styled-components'
import { Tabs } from '@/components/Tabs'

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding-top: 1.6rem;
  padding-bottom: 2.4rem;
`

const Title = styled.div`
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 3rem;
  margin: 0 auto 0 0;
  text-transform: capitalize;
  color: ${(props) => props.theme.color.grayscale16};
`

const StyledTabs = styled(Tabs)`
  height: 100%;
    
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
  Header,
  Title,
  StyledTabs as Tabs,
}
