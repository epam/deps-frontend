
import styled, { css } from 'styled-components'
import { Input } from '@/components/Input'

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
  justify-content: flex-end;
  gap: 0.8rem;
`

export const StyledInput = styled(Input)`
  font-size: 1.4rem;
  line-height: 2rem;
`

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.color.error};
  font-size: 1.2rem;
  line-height: 1.8rem;
  margin: 0;
  opacity: 0;

  ${(props) => props.$error && css`
    opacity: 1;
  `}
`

export const InfoMessage = styled.p`
  font-size: 1.4rem;
  line-height: 2rem;
  margin-bottom: 1.6rem;
`
