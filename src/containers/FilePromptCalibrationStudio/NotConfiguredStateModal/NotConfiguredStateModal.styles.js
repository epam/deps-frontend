
import styled from 'styled-components'

export const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.color.grayscale18};
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.4rem;
  margin: 0;
`

export const ModalContent = styled.div`
  display: grid;
  place-items: center;
  align-content: center;
  grid-gap: 3.2rem;
  flex: 1;
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`
