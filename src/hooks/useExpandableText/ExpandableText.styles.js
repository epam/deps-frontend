
import styled, { css } from 'styled-components'

const WrapperArrowIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  height: 2rem;
  width: 2rem;
  cursor: pointer;
  ${(props) => props.$isRotated && css`
    svg {
      transform: rotate(180deg);
    }
  `}
`

const ExpandableTextWrapper = styled.div`
  width: 100%;
`

export {
  WrapperArrowIcon,
  ExpandableTextWrapper,
}
