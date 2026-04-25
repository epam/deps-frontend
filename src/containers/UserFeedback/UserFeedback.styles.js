
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  position: fixed;
  right: 0;
  top: 50%;
  z-index: 1;
  transform: rotate(270deg) translateY(120%);
  
  ${(props) => !props.isVisible && css`
    display: none;
  `}
`

export {
  Wrapper,
}
