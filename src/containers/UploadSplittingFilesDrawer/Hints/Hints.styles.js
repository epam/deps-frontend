
import styled from 'styled-components'
import { CircleExclamationIcon } from '@/components/Icons/CircleExclamationIcon'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.color.grayscale18};
`

export const HintWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const StyledExclamationIcon = styled(CircleExclamationIcon)`
  color: ${(props) => props.theme.color.grayscale12};
`

export const FormatsList = styled.span`
  font-weight: 700;
  margin-right: 0.5rem;
`
