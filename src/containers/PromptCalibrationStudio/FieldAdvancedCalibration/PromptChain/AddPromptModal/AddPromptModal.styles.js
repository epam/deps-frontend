
import styled from 'styled-components'
import { Input } from '@/components/Input'
import { Modal } from '@/components/Modal'

export const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`

export const StyledModal = styled(Modal)`
  & .ant-modal {
    margin: 0;
  }

  .ant-modal-content {
    width: 50vw;
    height: 90vh;
    border-radius: 8px;
  }

  .ant-modal-body {
    display: flex;
    flex-direction: column;
    padding: 0;
    height: calc(100% - 5.3rem);
  }
`

export const InputWrapper = styled.div`
  padding: 1.6rem;
  background-color: ${({ theme }) => theme.color.grayscale14};
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayscale1};
`

export const TextArea = styled(Input.TextArea)`
  flex: 1;
  border: none;
  resize: none;
`
