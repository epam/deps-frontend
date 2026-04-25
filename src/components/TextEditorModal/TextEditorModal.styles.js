
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Modal } from '@/components/Modal'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const Wrapper = styled.form`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1.2rem;
`

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.color.error};
  font-size: 1.2rem;
  line-height: 1.6rem;
  padding: 0 0.4rem;
`

const ActionButton = styled(Button.Secondary)`
  font-size: 1.8rem;
  font-weight: 900;
`

const CancelButton = styled(ActionButton)`
  svg > path {
    fill: ${(props) => props.theme.color.grayscale22};
  }
`

const SubmitButton = styled(ActionButton)`
  svg > path {
    fill: ${(props) => props.theme.color.greenBright};
  }
`

const StyledInput = styled(Input)`
  width: 28rem;
  height: 3.2rem;
  border-radius: 0.4rem;
  padding: 0 0.8rem 0 1.2rem;
  &:focus {
    box-shadow: none;
  }
`

const StyledModal = styled(Modal)`
  &.ant-modal {
    margin: 0;
    position: absolute;
  }

  .ant-modal-content {
    width: 40rem;
    min-height: 6.2rem;
    border-radius: 0.8rem;
    border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};
    box-shadow: 0 0.3rem 1.9rem 0 ${(props) => props.theme.color.shadow3};
  }

  .ant-modal-body {
    padding: 1.6rem;
  }
`

export {
  SubmitButton,
  CancelButton,
  StyledInput as Input,
  StyledModal as Modal,
  Container,
  Wrapper,
  ErrorMessage,
}
