
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { Localization, localize } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { Field } from '../viewModels'
import {
  DrawerFooterWrapper,
  StyledDrawer,
} from './AddFieldDrawer.styles'
import { AddFieldForm } from './AddFieldForm'
import { DefaultFormValues } from './constants'

export const AddFieldDrawer = ({ add, defaultExtractorId }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const formApi = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: DefaultFormValues,
  })

  const toggleDrawerVisibility = useCallback(() => {
    setIsDrawerVisible((prev) => !prev)
  }, [setIsDrawerVisible])

  const submitData = useCallback(() => {
    const values = formApi.getValues()

    const field = Field.createEmpty({
      ...values,
      extractorId: defaultExtractorId,
    })

    add(field)
    toggleDrawerVisibility()
  }, [
    add,
    defaultExtractorId,
    formApi,
    toggleDrawerVisibility,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <Button
        onClick={toggleDrawerVisibility}
      >
        {localize(Localization.CANCEL)}
      </Button>
      <Button
        disabled={!formApi.formState.isValid}
        onClick={submitData}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SUBMIT)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    toggleDrawerVisibility,
    formApi.formState.isValid,
    submitData,
  ])

  return (
    <FormProvider {...formApi}>
      <Button.Secondary
        onClick={toggleDrawerVisibility}
      >
        <PlusIcon />
        {localize(Localization.ADD_FIELD)}
      </Button.Secondary>
      <StyledDrawer
        destroyOnClose
        footer={DrawerFooter}
        getContainer={() => document.body}
        hasCloseIcon={false}
        onClose={toggleDrawerVisibility}
        open={isDrawerVisible}
        title={localize(Localization.ADD_FIELD)}
        width={theme.size.drawerWidth}
      >
        <AddFieldForm />
      </StyledDrawer>
    </FormProvider>
  )
}

AddFieldDrawer.propTypes = {
  add: PropTypes.func.isRequired,
  defaultExtractorId: PropTypes.string.isRequired,
}
