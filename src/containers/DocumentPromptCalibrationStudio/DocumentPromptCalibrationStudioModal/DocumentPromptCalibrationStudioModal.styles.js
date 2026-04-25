
import styled from 'styled-components'
import { Modal as BaseModal } from '@/components/Modal'

export const Modal = styled(BaseModal)`
  .ant-modal {
    max-width: calc(100vw - 4.8rem);
    padding-bottom: 0;
  }

  .ant-modal-body {
    padding: 0;
    height: calc(100vh - 16rem);
  }
`

export const ModalContent = styled.div`
  height: calc(100vh - 16rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
`

export const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.color.grayscale18};
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.4rem;
  margin: 0;
`

export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.6rem;
  overflow: hidden;
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`
