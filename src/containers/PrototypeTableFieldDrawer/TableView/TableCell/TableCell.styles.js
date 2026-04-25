
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'
import { TrashIcon } from '@/components/Icons/TrashIcon'

const CellWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ButtonIcon = styled(Button.Icon)`
  min-width: 2.4rem;
  height: 2.4rem;
  border-radius: 2.4rem;
  margin-left: 1rem;
  border: 1px solid ${(props) => props.theme.color.grayscale21};
`

const DeleteIcon = styled(TrashIcon)`
  font-size: 1.1rem;
  path {
    fill: ${(props) => props.theme.color.grayscale12};
  }
`

const AddIcon = styled(NewPlusIcon)`
  path {
    fill: ${(props) => props.theme.color.grayscale12};
  }
`

export {
  CellWrapper,
  ButtonIcon,
  DeleteIcon,
  AddIcon,
}
