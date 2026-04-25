
import styled from 'styled-components'
import { SelectOptionModalButton } from '@/components/SelectOptionModalButton'

const StyledSelectOptionModalButton = styled(SelectOptionModalButton)`
  .ant-modal-body {
    padding: 1.6rem 1.6rem 0.8rem;
  }

  .ant-form-item-explain {
    display: none;
  }
`

export {
  StyledSelectOptionModalButton,
}
