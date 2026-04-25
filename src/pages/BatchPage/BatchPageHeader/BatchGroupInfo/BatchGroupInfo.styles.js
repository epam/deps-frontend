import styled from 'styled-components'

export const FontIconWrapper = styled.div`
  display: flex;
  align-items: center;

  & > svg {
    color: ${(props) => props.theme.color.grayscale12};
  }
`

export const Wrapper = styled.div`
  padding: 0.4rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  line-height: 2rem;
  color: ${(props) => props.theme.color.grayscale18};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.color.primary3};
`
