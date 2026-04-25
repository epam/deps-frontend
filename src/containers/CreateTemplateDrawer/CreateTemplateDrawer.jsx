
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  createTemplate,
  uploadTemplateVersionFile,
} from '@/api/templatesApi'
import { useDeleteDocumentTypeMutation } from '@/apiRTK/documentTypeApi'
import { Button, ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form/ReactHookForm'
import { TemplatePicker } from '@/containers/TemplatePicker'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { localize, Localization } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { navigationMap } from '@/utils/navigationMap'
import { notifySuccess, notifyError } from '@/utils/notification'
import { childrenShape } from '@/utils/propTypes'
import { goTo } from '@/utils/routerActions'
import {
  CancelButton,
  DrawerFooterWrapper,
  Drawer,
} from './CreateTemplateDrawer.styles'
import { CreateTemplateForm } from './CreateTemplateForm'

const CreateTemplateDrawer = ({
  children,
}) => {
  const [file, setFile] = useState(null)
  const [visible, setVisible] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [deleteDocumentType] = useDeleteDocumentTypeMutation()

  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: {
      language: KnownLanguage.ENGLISH,
    },
  })
  const {
    getValues,
    formState: {
      isValid, isDirty,
    },
  } = methods

  const isCreateDisabled = (
    !isDirty ||
    !isValid ||
    isCreating ||
    !file
  )

  const toggleVisibility = useCallback(() => {
    if (!isCreating) {
      setVisible((prev) => !prev)
      setFile(null)
    }
  }, [isCreating])

  const onOk = useCallback(async () => {
    const formValues = getValues()
    setIsCreating(true)
    let templateId

    try {
      ({ templateId } = await createTemplate(formValues))
      await uploadTemplateVersionFile({
        code: templateId,
        file,
        name: file.name,
        markupAutomatically: formValues?.markupAutomatically,
      },
      null,
      (err) => {
        throw err
      })
      notifySuccess(localize(Localization.ALL_UPLOADS_SUCCESS_STATUS))
      goTo(navigationMap.documentTypes.documentType(templateId))
    } catch (e) {
      const message = RESOURCE_ERROR_TO_DISPLAY[e?.response?.data?.code] ?? localize(Localization.ALL_TEMPLATE_UPLOADS_FAILURE_STATUS)
      notifyError(message)

      if (templateId) {
        await deleteDocumentType(templateId).unwrap()
      }
    } finally {
      setIsCreating(false)
    }
  }, [
    deleteDocumentType,
    file,
    getValues,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isCreating}
        onClick={toggleVisibility}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={isCreateDisabled}
        loading={isCreating}
        onClick={onOk}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.CREATE)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    isCreateDisabled,
    isCreating,
    onOk,
    toggleVisibility,
  ])

  return (
    <>
      <div onClick={toggleVisibility}>
        {children}
      </div>
      <Drawer
        destroyOnClose
        footer={DrawerFooter}
        getContainer={() => document.body}
        hasCloseIcon={false}
        onClose={toggleVisibility}
        open={visible}
        title={localize(Localization.ADD_TEMPLATE)}
        width={theme.size.drawerWidth}
      >
        <FormProvider {...methods}>
          <CreateTemplateForm />
        </FormProvider>
        <TemplatePicker
          file={file}
          setUploadedFile={setFile}
        />
      </Drawer>
    </>
  )
}

CreateTemplateDrawer.propTypes = {
  children: childrenShape,
}

export {
  CreateTemplateDrawer,
}
