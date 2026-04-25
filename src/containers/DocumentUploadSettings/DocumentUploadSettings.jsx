
import PropTypes from 'prop-types'
import { useMemo, useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ButtonType } from '@/components/Button'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import {
  DrawerFooterWrapper,
  DrawerHeaderWrapper,
  ResetButton,
  Drawer,
} from './DocumentUploadSettings.styles'
import {
  DEFAULT_FORM_SETTINGS,
  DocumentUploadSettingsForm,
} from './DocumentUploadSettingsForm'

const DRAWER_WIDTH = '64rem'

const DocumentUploadSettings = ({
  isVisible,
  onClose,
  setSettings,
}) => {
  const methods = useForm({
    shouldUnregister: true,
    defaultValues: DEFAULT_FORM_SETTINGS,
  })

  const {
    getValues,
    reset,
    watch,
  } = methods

  useEffect(() => {
    const subscription = watch(() => setSettings(getValues()))

    return () => subscription.unsubscribe()
  }, [getValues, setSettings, watch])

  const resetForm = useCallback(() => (
    reset()
  ), [reset])

  const DrawerTitle = useMemo(() => (
    <DrawerHeaderWrapper>
      {localize(Localization.ADDITIONAL_SETTINGS)}
    </DrawerHeaderWrapper>
  ), [])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <ResetButton
        onClick={resetForm}
        type={ButtonType.LINK}
      >
        {localize(Localization.RESET_ALL)}
      </ResetButton>
    </DrawerFooterWrapper>
  ), [resetForm])

  return (
    <Drawer
      closeIcon={<XMarkIcon />}
      footer={DrawerFooter}
      getContainer={() => document.body}
      maskClosable
      onClose={onClose}
      open={isVisible}
      placement={Placement.RIGHT}
      title={DrawerTitle}
      width={DRAWER_WIDTH}
    >
      <FormProvider {...methods}>
        <DocumentUploadSettingsForm />
      </FormProvider>
    </Drawer>
  )
}

DocumentUploadSettings.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setSettings: PropTypes.func.isRequired,
}

export {
  DocumentUploadSettings,
}
