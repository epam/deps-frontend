
import styled from 'styled-components'
import { LongText } from '@/components/LongText'

export const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const RadioGroupWrapper = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.color.grayscale14};
  outline: 0.1rem solid ${({ theme }) => theme.color.grayscale1};
  border-radius: 0.4rem;
  padding: 0.4rem 1.2rem;
  overflow: hidden;
  min-height: 3rem;
  display: flex;
  align-items: center;
`

export const FieldAlias = styled(LongText)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.color.grayscale22};
  width: 100%;
`
