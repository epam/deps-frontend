
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'

const Modal = styled.div`
  position: absolute;
  z-index: 1100;
  width: 37.2rem;
  border-radius: 4px;
  background-color: ${(props) => props.theme.color.grayscale14};
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  box-shadow: 0 3px 19px 0 ${(props) => props.theme.color.shadow3};
`

const ModalHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem;
  background-color: ${(props) => props.theme.color.primary3};
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 4px;
`

const ModalFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1.6rem;
  border-top: 1px solid ${(props) => props.theme.color.grayscale15};
`

const CloseIcon = styled(XMarkIcon)`
  cursor: pointer;
`

const Title = styled.h3`
  color: ${(props) => props.theme.color.grayscale16};
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2.2rem;
`

const Description = styled.p`
  color: ${(props) => props.theme.color.grayscale11};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.6rem;
  margin: 0;
`

const SubmitButton = styled(Button)`
  width: 10.4rem;
  font-weight: 600;
  margin-left: 1.6rem;
  border: 1px solid ${(props) => props.theme.color.grayscale21};

  &&:disabled,
  &&:disabled:hover {
    color: ${(props) => props.theme.color.grayscale15};
    background-color: ${(props) => props.theme.color.grayscale22};
    border: 1px solid ${(props) => props.theme.color.grayscale22};
  }
`

export {
  CloseIcon,
  Description,
  Modal,
  ModalHeaderWrapper,
  ModalFooterWrapper,
  Title,
  SubmitButton,
}
