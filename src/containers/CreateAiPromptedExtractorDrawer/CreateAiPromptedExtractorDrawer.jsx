
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { createDocumentType } from '@/api/documentTypesApi'
import { Button, ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form/ReactHookForm'
import { ExtractionType } from '@/enums/ExtractionType'
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
} from './CreateAiPromptedExtractorDrawer.styles'
import { CreateAiPromptedExtractorForm } from './CreateAiPromptedExtractorForm'

const CreateAiPromptedExtractorDrawer = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
  })

  const {
    getValues,
    formState: { isValid, isDirty },
    handleSubmit,
  } = methods

  const isCreateDisabled = (
    !isDirty ||
    !isValid ||
    isCreating
  )

  const toggleVisibility = useCallback(() => {
    if (!isCreating) {
      setVisible((prev) => !prev)
    }
  }, [isCreating])

  const onOk = useCallback(async () => {
    try {
      setIsCreating(true)
      const { name } = getValues()
      const { documentTypeId } = await createDocumentType({
        name,
        extractorType: ExtractionType.AI_PROMPTED,
      })

      goTo(navigationMap.documentTypes.documentType(documentTypeId))
      notifySuccess(localize(Localization.AI_PROMPTED_CREATION_SUCCESS_MESSAGE))
    } catch (error) {
      notifyError(localize(Localization.DEFAULT_ERROR_MESSAGE))
    } finally {
      setIsCreating(false)
    }
  }, [getValues])

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
        title={localize(Localization.ADD_AI_PROMPTED)}
        width={theme.size.drawerWidth}
      >
        <FormProvider {...methods}>
          <CreateAiPromptedExtractorForm
            createAiPromptedExtractor={onOk}
            handleSubmit={handleSubmit}
          />
        </FormProvider>
      </Drawer>
    </>
  )
}

CreateAiPromptedExtractorDrawer.propTypes = {
  children: childrenShape.isRequired,
}

export {
  CreateAiPromptedExtractorDrawer,
}
