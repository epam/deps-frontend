
import styled from 'styled-components'
import { Heading } from '@/components/Heading'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1.6rem 0 2.4rem;
`

const Title = styled(Heading)`
  max-width: 50rem;
  &.ant-typography {
    margin-bottom: 0;
  }
`

const Column = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-auto-flow: column;
`

export {
  Column,
  Wrapper,
  Title,
}
