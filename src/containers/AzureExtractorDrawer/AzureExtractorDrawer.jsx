
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form/ReactHookForm'
import { localize, Localization } from '@/localization/i18n'
import { azureExtractorShape } from '@/models/AzureExtractor'
import { theme } from '@/theme/theme.default'
import { childrenShape } from '@/utils/propTypes'
import {
  DrawerFooterWrapper,
  Drawer,
} from './AzureExtractorDrawer.styles'
import { AzureExtractorForm } from './AzureExtractorForm'

const AzureExtractorDrawer = ({
  extractorData,
  children,
  isConnectionDataLoading,
  isLoading,
  onSave,
}) => {
  const [visible, setVisible] = useState(false)
  const [areCredentialsValid, setAreCredentialsValid] = useState(false)

  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: {
      language: localize(Localization.AUTODETECTED),
    },
  })

  const {
    getValues,
    formState: {
      isValid, isDirty,
    },
  } = methods

  const isSubmitDisabled = (
    !isDirty ||
    !isValid ||
    isLoading ||
    !areCredentialsValid
  )

  const toggleVisibility = useCallback(() => {
    if (!isLoading) {
      setVisible((prev) => !prev)
    }
  }, [isLoading])

  const onOk = useCallback(async () => {
    const formValues = getValues()
    const data = {
      name: formValues.name.trim(),
      apiKey: formValues.apiKey.trim(),
      endpoint: formValues.endpoint.trim(),
      modelId: formValues.modelId.trim(),
    }

    await onSave(data)
    toggleVisibility()
  }, [
    getValues,
    onSave,
    toggleVisibility,
  ])

  const drawerTitle = (
    extractorData
      ? localize(Localization.EDIT_AZURE_CLOUD_NATIVE_EXTRACTOR)
      : localize(Localization.ADD_AZURE_CLOUD_NATIVE_EXTRACTOR)
  )

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <Button.Secondary
        disabled={isLoading}
        onClick={toggleVisibility}
      >
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Button
        disabled={isSubmitDisabled}
        loading={isLoading}
        onClick={onOk}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SUBMIT)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    isSubmitDisabled,
    isLoading,
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
        title={drawerTitle}
        width={theme.size.drawerWidth}
      >
        <FormProvider {...methods}>
          <AzureExtractorForm
            extractorData={extractorData}
            isConnectionDataLoading={isConnectionDataLoading}
            setAreCredentialsValid={setAreCredentialsValid}
          />
        </FormProvider>
      </Drawer>
    </>
  )
}

AzureExtractorDrawer.propTypes = {
  extractorData: azureExtractorShape,
  children: childrenShape,
  isConnectionDataLoading: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
}

export {
  AzureExtractorDrawer,
}
