
import styled from 'styled-components'
import { LongText } from '@/components/LongText'

export const ReferenceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-left: 1px solid ${({ theme }) => theme.color.grayscale17};
  padding-left: 0.8rem;
  max-width: 43rem;
  cursor: pointer;
`

export const RefName = styled(LongText)`
  color: ${({ theme }) => theme.color.primary2};
  font-size: 1.2rem;
  line-height: 2rem;
`

export const RefType = styled.div`
  font-size: 1rem;
  line-height: 1.2;
  color: ${({ theme }) => theme.color.grayscale12};
`
