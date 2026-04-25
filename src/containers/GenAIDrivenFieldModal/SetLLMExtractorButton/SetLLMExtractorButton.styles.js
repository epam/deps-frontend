
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border: none !important;
  }
`
const ModalContent = styled.div`
  height: fit-content;
  max-height: 26rem;
  overflow: auto;

  @media (min-height: 640px) {
    max-height: 34rem;
  }
  background-color: ${(props) => props.theme.color.primary3};
  border-radius: 0.8rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  box-shadow: 0 3px 1.9rem 0 ${(props) => props.theme.color.shadow3};
`

const ModalHeader = styled.div`
  display: flex;
  padding: 1.6rem;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
`

const ModalTitle = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.2rem;
  text-transform: uppercase;
  color: ${(props) => props.theme.color.grayscale13};
`

const ModalBody = styled.div`
  padding: 0 1.6rem 1.6rem;
  overflow: auto;
`

const CreateLLMExtractorButton = styled(Button.Secondary)`
  height: 2.4rem;
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 0;

  &&:hover,
  &&:focus {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  
  & > svg {
    margin-right: 1rem;
  }
`

export {
  CreateLLMExtractorButton,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
  StyledModal as Modal,
}
