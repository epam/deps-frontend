
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const Title = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.grayscale18};
`

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  color: ${({ theme }) => theme.color.grayscale18};
  font-weight: 500;
  max-width: 60%;
`
