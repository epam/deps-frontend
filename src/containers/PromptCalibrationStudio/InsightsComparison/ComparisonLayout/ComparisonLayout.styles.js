
import styled from 'styled-components'
import { ExclamationCircleOutlinedIcon } from '@/components/Icons/ExclamationCircleOutlinedIcon'
import { LongText } from '@/components/LongText'

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

export const PseudoInputsWrapper = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
`

export const FieldWrapper = styled.div`
  flex: 1;
  min-width: 0;
`

export const Label = styled(LongText)`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale11};
`

export const HintWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: ${(props) => props.theme.color.grayscale11};
  text-transform: lowercase;
`

export const HintContent = styled.span`
  width: 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: end;
`

export const HintContentNew = styled(HintContent)`
  color: ${(props) => props.theme.color.success};
  text-align: start;
`

export const ExclamationCircleIcon = styled(ExclamationCircleOutlinedIcon)`
  color: ${(props) => props.theme.color.primary2};
`
