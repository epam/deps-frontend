
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Button, ButtonType } from '@/components/Button'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { Localization, localize } from '@/localization/i18n'
import { FieldsList } from './FieldsList'
import {
  CancelButton,
  DrawerFooterWrapper,
  StyledDrawer,
} from './ReorderFieldsButton.styles'

const drawerWidth = '90%'

export const ReorderFieldsButton = () => {
  const { fields, reorderFields } = useFieldCalibration()

  const [draggableFields, setDraggableFields] = useState(fields)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const areFieldsReordered = fields.some((item, index) => {
    const reorderedIndex = draggableFields.findIndex((reorderedItem) => reorderedItem.id === item.id)
    return reorderedIndex !== index
  })

  const openDrawer = useCallback(() => {
    setDraggableFields(fields)
    setIsDrawerVisible(true)
  }, [fields])

  const closeDrawer = useCallback(() => {
    setIsDrawerVisible(false)
  }, [])

  const updateFields = useCallback(() => {
    const updatedFieldsOrder = draggableFields.map((field, order) => ({
      ...field,
      order,
    }))

    reorderFields(updatedFieldsOrder)
    closeDrawer()
  }, [
    draggableFields,
    reorderFields,
    closeDrawer,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        onClick={closeDrawer}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={!areFieldsReordered}
        onClick={updateFields}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    closeDrawer,
    updateFields,
    areFieldsReordered,
  ])

  return (
    <>
      <Button.Secondary onClick={openDrawer}>
        {localize(Localization.FIELDS_ORDER)}
      </Button.Secondary>
      <StyledDrawer
        destroyOnClose
        footer={DrawerFooter}
        getContainer={() => document.body}
        hasCloseIcon={false}
        onClose={closeDrawer}
        open={isDrawerVisible}
        title={localize(Localization.CHANGE_FIELDS_ORDER)}
        width={drawerWidth}
      >
        <FieldsList
          fields={draggableFields}
          setFields={setDraggableFields}
        />
      </StyledDrawer>
    </>
  )
}
