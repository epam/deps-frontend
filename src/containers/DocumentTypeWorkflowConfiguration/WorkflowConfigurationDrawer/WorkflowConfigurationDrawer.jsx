
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ButtonType, Button } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { Localization, localize } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { WorkflowConfigurationForm } from '../WorkflowConfigurationForm'
import { CancelButton, DrawerFooterWrapper, Drawer } from './WorkflowConfigurationDrawer.styles'

const WorkflowConfigurationDrawer = ({
  visible,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
  })

  const { getValues, handleSubmit } = methods

  const handleSave = useCallback(async () => {
    const values = getValues()
    await onSubmit(values)
  }, [getValues, onSubmit])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isLoading}
        onClick={onClose}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        loading={isLoading}
        onClick={handleSubmit(handleSave)}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    isLoading,
    onClose,
    handleSave,
    handleSubmit,
  ])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onClose={onClose}
      open={visible}
      title={localize(Localization.WORKFLOW_CONFIGURATION)}
      width={theme.size.drawerWidth}
    >
      <FormProvider {...methods}>
        <WorkflowConfigurationForm
          handleSubmit={handleSubmit}
          onSubmit={handleSave}
        />
      </FormProvider>
    </Drawer>
  )
}

WorkflowConfigurationDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export {
  WorkflowConfigurationDrawer,
}
