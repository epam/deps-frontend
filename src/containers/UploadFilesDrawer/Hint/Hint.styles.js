
import styled from 'styled-components'
import { CircleExclamationIcon } from '@/components/Icons/CircleExclamationIcon'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
`

export const StyledExclamationIcon = styled(CircleExclamationIcon)`
  color: ${(props) => props.theme.color.grayscale12};
  margin-right: 1rem;
`

export const FormatsList = styled.span`
  font-weight: 700;
  color: ${(props) => props.theme.color.grayscale18};
  margin-right: 0.5rem;
`
