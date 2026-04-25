
import styled, { css } from 'styled-components'
import { HandsonTable } from '@/components/HandsonTable'

const StyledHandsonTable = styled(HandsonTable)`
  margin: 1.6rem;
  
  ${(props) => props.$isActive && css`
  border: 1px solid ${(props) => props.theme.color.primary2};
  `}

  ${(props) => props.$isEditMode && css`
  cursor: pointer;
  `}
  
  .htCore {
    pointer-events: none;
  }
`

const Wrapper = styled.div`
  position: relative;
`

export {
  StyledHandsonTable as HandsonTable,
  Wrapper,
}
