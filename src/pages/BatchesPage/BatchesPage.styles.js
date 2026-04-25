
import styled from 'styled-components'

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding-top: 1.6rem;
  padding-bottom: 2.4rem;
  place-content: space-between;
  gap: 1.6rem;
`

export const Title = styled.div`
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 3rem;
  margin: 0 auto 0 0;
  text-transform: capitalize;
  color: ${(props) => props.theme.color.grayscale16};
  `
