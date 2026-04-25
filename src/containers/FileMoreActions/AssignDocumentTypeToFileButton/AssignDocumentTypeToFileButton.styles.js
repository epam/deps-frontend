
import styled from 'styled-components'
import { SelectOptionModalButton } from '@/components/SelectOptionModalButton'

const StyledSelectOptionModalButton = styled(SelectOptionModalButton)`
  width: 100%;
  text-align: left;
  padding: 5px 12px;
  border: none;
  box-shadow: none;

  &:hover {
    background-color: ${(props) => props.theme.color.itemHover};
  }

  &:disabled {
    background-color: transparent;
    color: ${(props) => props.theme.color.textDisabled};
    cursor: not-allowed;
  }
`

export {
  StyledSelectOptionModalButton,
}
