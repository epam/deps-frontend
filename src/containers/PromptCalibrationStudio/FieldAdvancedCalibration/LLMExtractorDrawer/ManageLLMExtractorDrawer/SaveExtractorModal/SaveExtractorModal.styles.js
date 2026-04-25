
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.color.grayscale18};
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.4rem;
  margin: 0;
`

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.color.grayscale11};
`

export const Footer = styled.div`
  display: flex;
  gap: 0.8rem;
`

export const CreateNewButton = styled(Button.Secondary)`
  margin-left: auto !important;
`

export const InfoMessage = styled.p`
  font-size: 1.4rem;
  line-height: 2rem;
  margin-bottom: 1.6rem;
`
