
import styled from 'styled-components'
import { Button } from '@/components/Button'

const Link = styled(Button.Link)`
  color: ${(props) => props.theme.color.primary4};
  margin-top: 1rem;
  
  span {
    text-decoration: underline;
  }
`

export {
  Link,
}
