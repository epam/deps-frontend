
import styled from 'styled-components'

export const Label = styled.div`
  font-size: 1.2rem;
  line-height: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale11};
  text-transform: uppercase;
`

export const EnvWrapper = styled.div`
  display: grid;
  gap: 0.8rem;
`

export const BtnGroup = styled.div`
  display: grid;
  grid-auto-flow: column;

  & > *:first-child {
    border-radius: 0.4rem 0 0 0.4rem;
  }

  & > *:last-child {
    border-radius: 0 0.4rem 0.4rem 0;
  }

  & > *:not(:first-child):not(:last-child) {
    border-radius: 0;
  }
`
