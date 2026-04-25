
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5rem;
`

export const Content = styled.p`
  line-height: 2.2rem;
  color: ${({ theme }) => theme.color.grayscale12};
`
