
import styled from 'styled-components'

export const Wrapper = styled.div`
  min-width: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const NumberOfChildDocuments = styled.div`
  position: absolute;
  font-size: 1rem;
  color: ${(props) => props.theme.color.primary2};
`

export const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.3rem;
  height: 4.2rem;
  stroke-width: 0.3;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: ${(props) => props.theme.color.grayscale18};
  }
`

export const ExtensionText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => props.theme.color.grayscale18};
  text-transform: uppercase;
  line-height: 1;
  pointer-events: none;
  z-index: 1;
  margin-top: 2rem;
  margin-left: -0.8rem;
  background-color: ${(props) => props.theme.color.primary3};
  padding: 0.1rem;
`
