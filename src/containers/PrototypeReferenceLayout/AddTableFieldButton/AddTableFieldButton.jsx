
import { useDispatch } from 'react-redux'
import { toggleAddFieldDrawer } from '@/actions/prototypePage'
import { PlusFilledIcon } from '@/components/Icons/PlusFilledIcon'
import { ButtonIcon } from './AddTableFieldButton.styles'

const AddTableFieldButton = () => {
  const dispatch = useDispatch()

  const showAddFieldDrawer = () => {
    dispatch(toggleAddFieldDrawer())
  }

  return (
    <ButtonIcon
      icon={<PlusFilledIcon />}
      onClick={showAddFieldDrawer}
    />
  )
}

export {
  AddTableFieldButton,
}
