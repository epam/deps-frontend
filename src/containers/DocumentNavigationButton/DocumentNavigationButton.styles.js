
import styled from 'styled-components'
import { TableActionIcon } from '@/components/TableActionIcon'

const NavigationButton = styled(TableActionIcon)`
  width: 2.4rem;
  height: 2.4rem;

  svg {
    path {
      fill: ${(props) => props.theme.color.grayscale12};
    }
  }
 
  &:hover,
  &:focus {
    border: none;
    box-shadow: none;
  }
`

const Wrapper = styled.div`
  margin-left: 1rem;
`

export {
  NavigationButton,
  Wrapper,
}
