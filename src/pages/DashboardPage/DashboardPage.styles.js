
import styled from 'styled-components'
import { Content } from '@/components/Layout'

const StyledContent = styled(Content)`
  padding-bottom: 2.5rem;
  overflow: auto;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.6rem;
  padding-bottom: 2.4rem;
  font-size: 2.2rem;
  font-weight: 600;
`

export {
  StyledContent as Content,
  Title,
}
