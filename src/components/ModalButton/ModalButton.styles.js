
import styled from 'styled-components'
import { Modal } from '@/components/Modal'
import { ComponentSize } from '@/enums/ComponentSize'

const SMALL_MODAL = `
  .ant-modal-header {
    padding: 1rem 1.5rem;
  }

  .ant-modal-close-x {
    height: 4.4rem;
    width: 4.4rem;
    line-height: 4.4rem;
  }

  .ant-modal-body {
    padding: 1.5rem;
  }

  .ant-modal-footer {
    padding: 1rem 1.5rem;
  }
`

const SizeableModal = styled(Modal)`
  .ant-modal {
    padding-top: 2.4rem;
  }

  ${({ size }) => size === ComponentSize.SMALL && SMALL_MODAL}
`

export {
  SizeableModal as Modal,
}
