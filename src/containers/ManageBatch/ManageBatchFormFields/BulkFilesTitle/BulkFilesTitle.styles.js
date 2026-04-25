
import styled from 'styled-components'
import { CircleExclamationIcon as CircleExclamationIconComponent } from '@/components/Icons/CircleExclamationIcon'

export const BulkFilesTitleWrapper = styled.div`
  display: grid;
  grid-gap: 0.4rem;
`

export const FirstLine = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.grayscale18};
  line-height: 1.2rem;
  text-transform: uppercase;
`

export const SecondLine = styled.h4`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.color.grayscale13};
  line-height: 1.6rem;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.8rem;
  align-items: center;
`

export const CircleExclamationIcon = styled(CircleExclamationIconComponent)`
  path {
    fill: ${({ theme }) => theme.color.grayscale12};
  }
`
