
import styled from 'styled-components'
import { DraggableModal } from '@/components/DraggableModal'
import { Modal } from '@/components/Modal'

const ExpandedModal = styled(Modal)`
  padding: 2rem 0;
  height: 100%;
    
  .ant-modal-content {
    height: 100%;
    overflow: hidden;
    border-radius: 0.8rem;
    border-top: 1px solid ${(props) => props.theme.color.grayscale15};
  }
    
  .ant-modal-body {
    height: calc(100% - 6rem);
    overflow: hidden;
  }

  .ant-modal-body, 
  .ant-modal-header {
    padding: 0;
  }
`

const StyledDraggableModal = styled(DraggableModal)`
  min-height: 70vh;
`

export {
  ExpandedModal,
  StyledDraggableModal as DraggableModal,
}
