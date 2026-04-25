
import styled from 'styled-components'
import { ExclamationCircleOutlinedIcon } from '@/components/Icons/ExclamationCircleOutlinedIcon'

export const NotConfiguredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  padding: 4rem 2rem;
  text-align: center;
`

export const WarningIcon = styled(ExclamationCircleOutlinedIcon)`
  font-size: 4.8rem;
  color: ${({ theme }) => theme.color.warning};
`

export const NotConfiguredText = styled.div`
  font-size: 1.4rem;
  line-height: 2rem;
  color: ${({ theme }) => theme.color.grayscale18};
  max-width: 60rem;
`
