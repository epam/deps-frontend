
import styled from 'styled-components'

export const Counter = styled.div`
  padding: 0.3rem 1.2rem;
  font-size: 1.4rem;
  line-height: 2.2rem;
  font-weight: 600;
  background-color: ${(props) => props.theme.color.primary3};
  border-radius: 0.8rem;
`

export const TotalText = styled.div`
  font-size: 1.2rem;
  line-height: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale13};
`

export const Wrapper = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
`
