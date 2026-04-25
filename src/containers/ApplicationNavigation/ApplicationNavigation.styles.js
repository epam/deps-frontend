
import styled from 'styled-components'
import { Sidebar } from '@/components/Sidebar'

const StyledSidebar = styled(Sidebar)`
  & > div > ul > li:last-child {
    position: absolute;
    bottom: 2.8rem;
  }
`

const FontIconWrapper = styled.div`
  & > svg {
    width: 2.1rem;
    height: 2.1rem;
    transition: color 0.2s;
    color: ${(props) => props.theme.color.primary2Lighter};
  }
`

export {
  StyledSidebar as Sidebar,
  FontIconWrapper,
}
