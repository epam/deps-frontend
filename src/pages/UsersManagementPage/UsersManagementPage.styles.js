
import styled from 'styled-components'
import { Heading } from '@/components/Heading'
import { Tabs } from '@/components/Tabs'

const StyledTabs = styled(Tabs)`
  height: 100%;
    
  .ant-tabs-nav {
    margin-bottom: 1.6rem;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding-top: 1.6rem;
  padding-bottom: 2.4rem;
`

const Title = styled(Heading)`
  width: 100%;
  && {
    margin-bottom: 0;
  }
`

export {
  Header,
  StyledTabs as Tabs,
  Title,
}
