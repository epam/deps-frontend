
import styled from 'styled-components'

export const Link = styled.a`
  &[disabled] {
    color: ${(props) => props.theme.color.grayscale1Darker};
  }
`
