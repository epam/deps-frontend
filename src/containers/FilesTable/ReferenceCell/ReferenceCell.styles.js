
import styled from 'styled-components'

export const ReferenceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.4rem 0.8rem;
`

export const RefName = styled.div`
  color: ${({ theme }) => theme.color.primary2};
  font-size: 1.4rem;
  line-height: 2.2rem;
  cursor: pointer;
  max-width: 100%;
`

export const RefType = styled.div`
  font-size: 1rem;
  line-height: 1.2;
  color: ${({ theme }) => theme.color.grayscale12};
`
