
import styled, { createGlobalStyle, css } from 'styled-components'

const DraggableGlobalStyles = createGlobalStyle`
  .react-draggable-transparent-selection {
    user-select: none;
  }
`

const Modal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.grayscale14};
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  box-shadow: 0 0 4rem ${(props) => props.theme.color.shadow3};
`

const ModalHeader = styled.div`
  flex-shrink: 0;
  ${(props) => props.$isDraggable && css`
    cursor: move;
  `}
`

export {
  Modal,
  ModalContent,
  ModalHeader,
  DraggableGlobalStyles,
}
