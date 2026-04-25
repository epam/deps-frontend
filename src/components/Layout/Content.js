
import styled from 'styled-components'
import { Layout } from './Layout'

const Content = styled(Layout.Content)`
  background: ${(props) => props.theme.color.primary5};
  padding: 1.6rem 1.9rem 0;
  margin: 0;
  min-height: 28rem;
  display: flex;
  flex-direction: column;
`

export {
  Content,
}
