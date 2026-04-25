
import { useCallback, useState } from 'react'
import { ButtonType } from '@/components/Button'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'
import { localize, Localization } from '@/localization/i18n'
import { AddBatchDrawer } from '../AddBatchDrawer'
import { StyledButton } from './AddBatchDrawerButton.styles'

const TEST_ID = {
  ADD_BUTTON: 'add-batch-drawer-add-button',
}

export const AddBatchDrawerButton = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const openDrawer = useCallback(() => {
    setIsDrawerVisible(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerVisible(false)
  }, [])

  return (
    <>
      <StyledButton
        data-testid={TEST_ID.ADD_BUTTON}
        onClick={openDrawer}
        type={ButtonType.PRIMARY}
      >
        <NewPlusIcon />
        {localize(Localization.ADD_NEW_BATCH)}
      </StyledButton>
      <AddBatchDrawer
        isVisible={isDrawerVisible}
        onClose={closeDrawer}
      />
    </>
  )
}
