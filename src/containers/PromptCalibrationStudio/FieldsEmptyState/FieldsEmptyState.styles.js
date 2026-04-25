
import styled from 'styled-components'
import emptyPageImage from '@/assets/images/emptyPage.png'

export const EmptyStateContainer = styled.div`
  display: grid;
  place-items: center;
  align-content: center;
  grid-gap: 3.2rem;
  flex: 1;
`

export const EmptyStateImage = styled.div`
  width: 30%;
  aspect-ratio: 1;
  background-image: url(${emptyPageImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

export const EmptyStateText = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2.2rem;
  color: ${({ theme }) => theme.color.grayscale5};
  text-align: center;
`
