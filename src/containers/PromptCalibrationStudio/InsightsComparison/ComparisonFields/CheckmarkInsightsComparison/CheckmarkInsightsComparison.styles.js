
import styled from 'styled-components'
import { LongText } from '@/components/LongText'

export const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  border: 0.1rem solid ${(props) => props.theme.color.grayscale15};
  border-bottom: 0.2rem solid ${({ $borderColor }) => $borderColor};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.color.grayscale14};
`

export const RadioGroupWrapper = styled.div`
  width: 100%;
  min-height: 3.2rem;
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const FieldAlias = styled(LongText)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.color.grayscale22};
  width: 100%;
`
