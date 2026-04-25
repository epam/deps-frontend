
import styled from 'styled-components'
import { Modal } from '@/components/Modal'

const StyledModal = styled(Modal)`
  max-width: 40rem;

  & .ant-modal-header,
  & .ant-modal-footer {
    border: none;
    padding: 1.6rem;
  }

  & .ant-modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1.6rem;
  }
`

const Title = styled.p`
  font-weight: 600;
  font-size: 1.6rem;
`

const Text = styled.span`
  padding: 2rem 0; 
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.grayscale4Darker};
  white-space: pre-line;
`

export {
  StyledModal as Modal,
  Title,
  Text,
}
