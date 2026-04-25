
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useUpdateDocumentTypesGroupMutation } from '@/apiRTK/documentTypesGroupsApi'
import { Button } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { Spin } from '@/components/Spin'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { documentTypesGroupShape } from '@/models/DocumentTypesGroup'
import { theme } from '@/theme/theme.default'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import {
  CancelButton,
  Drawer,
  DrawerFooterWrapper,
} from './EditDocumentTypesGroupDrawerButton.styles'
import { EditDocumentTypesGroupForm } from './EditDocumentTypesGroupForm'

const EditDocumentTypesGroupDrawerButton = ({ group }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const [
    updateDocumentTypesGroup,
    { isLoading },
  ] = useUpdateDocumentTypesGroupMutation()

  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
  })

  const {
    getValues,
    formState: {
      isValid,
    },
    handleSubmit,
  } = methods

  const toggleDrawer = useCallback(() =>
    setIsDrawerVisible((prev) => !prev),
  [])

  const saveGroup = useCallback(async () => {
    try {
      await updateDocumentTypesGroup({
        groupId: group.id,
        groupInfo: getValues(),
      }).unwrap()
      notifySuccess(localize(Localization.DOC_TYPES_GROUP_SUCCESS_UPDATE))
      toggleDrawer()
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }, [
    getValues,
    group.id,
    toggleDrawer,
    updateDocumentTypesGroup,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isLoading}
        onClick={toggleDrawer}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button.Secondary
        disabled={!isValid}
        loading={isLoading}
        onClick={saveGroup}
      >
        {localize(Localization.SAVE)}
      </Button.Secondary>
    </DrawerFooterWrapper>
  ), [
    isLoading,
    toggleDrawer,
    isValid,
    saveGroup,
  ])

  return (
    <>
      <Button.Secondary
        onClick={toggleDrawer}
      >
        {localize(Localization.EDIT)}
      </Button.Secondary>
      <Drawer
        destroyOnClose
        footer={DrawerFooter}
        hasCloseIcon={false}
        onClose={toggleDrawer}
        open={isDrawerVisible}
        title={localize(Localization.EDIT_GROUP)}
        width={theme.size.drawerWidth}
      >
        <Spin spinning={isLoading}>
          <FormProvider {...methods}>
            <EditDocumentTypesGroupForm
              group={group}
              handleSubmit={handleSubmit}
              saveGroup={saveGroup}
            />
          </FormProvider>
        </Spin>
      </Drawer>
    </>
  )
}

EditDocumentTypesGroupDrawerButton.propTypes = {
  group: documentTypesGroupShape.isRequired,
}

export {
  EditDocumentTypesGroupDrawerButton,
}
