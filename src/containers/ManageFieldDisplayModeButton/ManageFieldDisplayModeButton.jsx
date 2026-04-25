
import PropTypes from 'prop-types'
import {
  useState,
  useMemo,
  useCallback,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, ButtonType } from '@/components/Button'
import { Form } from '@/components/Form'
import { MaskIcon } from '@/components/Icons/MaskIcon'
import { ManageDisplayModeFormSection } from '@/containers/ManageDisplayModeFormSection'
import { ComponentSize } from '@/enums/ComponentSize'
import { localize, Localization } from '@/localization/i18n'
import { prototypeFieldShape } from '@/models/PrototypeField'
import { theme } from '@/theme/theme.default'
import {
  Drawer,
  CancelButton,
  DrawerFooterWrapper,
  OpenDrawerButton,
  DisplayModeIndicator,
} from './ManageFieldDisplayModeButton.styles'

const BADGE_OFFSET = [-5, 5]

const ManageFieldDisplayModeButton = ({
  updateDisplayMode,
  field,
}) => {
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false)

  const methods = useForm({
    shouldUnregister: true,
  })

  const { getValues } = methods

  const isEditMode = !!updateDisplayMode

  const toggleVisibility = useCallback(() => {
    setIsVisibleDrawer((prev) => !prev)
  }, [])

  const onSubmit = useCallback(() => {
    const { confidential, displayCharLimit, readOnly } = getValues()

    updateDisplayMode({
      confidential,
      readOnly,
      displayCharLimit,
    })
    toggleVisibility()
  }, [
    getValues,
    toggleVisibility,
    updateDisplayMode,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        onClick={toggleVisibility}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        onClick={onSubmit}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SUBMIT)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    toggleVisibility,
    onSubmit,
  ])

  return (
    <>
      <Drawer
        destroyOnClose
        footer={isEditMode && DrawerFooter}
        getContainer={() => document.body}
        hasCloseIcon={false}
        onClose={toggleVisibility}
        open={isVisibleDrawer}
        title={localize(Localization.DISPLAY_MODE)}
      >
        <FormProvider {...methods}>
          <Form>
            <ManageDisplayModeFormSection
              displayCharLimit={
                field?.fieldType?.description?.displayCharLimit ||
                field?.fieldType?.description?.baseTypeMeta?.displayCharLimit
              }
              fieldName={field?.name}
              isConfidentialField={field?.confidential}
              isEditMode={isEditMode}
              isReadOnlyField={field?.readOnly}
            />
          </Form>
        </FormProvider>
      </Drawer>
      <DisplayModeIndicator
        color={theme.color.error}
        dot={field.readOnly || field.confidential}
        offset={BADGE_OFFSET}
        size={ComponentSize.DEFAULT}
      >
        <OpenDrawerButton
          icon={<MaskIcon />}
          onClick={toggleVisibility}
          tooltip={
            {
              title: localize(Localization.MANAGE_DISPLAY_MODE),
            }
          }
        />
      </DisplayModeIndicator>
    </>
  )
}

ManageFieldDisplayModeButton.propTypes = {
  updateDisplayMode: PropTypes.func,
  field: prototypeFieldShape,
}

export {
  ManageFieldDisplayModeButton,
}
