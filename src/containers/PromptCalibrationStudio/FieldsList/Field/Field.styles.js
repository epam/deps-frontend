
import styled from 'styled-components'
import { LongText as LongTextComponent } from '@/components/LongText'

export const CardContainer = styled.div`
  background: ${({ theme }) => theme.color.primary3};
  border-bottom: 0.1rem solid ${({ theme }) => theme.color.grayscale1};
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  height: 2.4rem;
`

export const FieldName = styled(LongTextComponent)`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2rem;
  color: ${({ theme }) => theme.color.grayscale11};
`

export const CalibrateButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: auto;
`

export const CalibrateIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 2rem;
  color: ${({ theme }) => theme.color.primary2};
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
`

export const CalibrateText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2rem;
  color: ${({ theme }) => theme.color.primary2};
  margin: 0;
  white-space: nowrap;
`
