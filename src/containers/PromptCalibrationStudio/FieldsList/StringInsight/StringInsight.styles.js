
import styled from 'styled-components'
import { LongText as LongTextComponent } from '@/components/LongText'

export const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ValueField = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.color.grayscale14};
  outline: 0.1rem solid ${({ theme }) => theme.color.grayscale1};
  border-radius: 0.4rem;
  padding: 0.4rem 1.2rem;
  overflow: hidden;
  min-height: 3rem;
`

export const ValueText = styled(LongTextComponent)`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2.2rem;
  color: ${({ theme }) => theme.color.grayscale22};
  width: 100%;
`

export const FieldAlias = styled(LongTextComponent)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.color.grayscale22};
  width: 100%;
`
