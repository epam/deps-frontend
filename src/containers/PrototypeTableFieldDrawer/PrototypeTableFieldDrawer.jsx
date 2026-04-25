
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { ButtonType, Button } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { Localization, localize } from '@/localization/i18n'
import { prototypeTableFieldShape } from '@/models/PrototypeTableField'
import { activeTableSelector } from '@/selectors/prototypePage'
import {
  CancelButton,
  Drawer,
  DrawerFooterWrapper,
  Title,
} from './PrototypeTableFieldDrawer.styles'
import { PrototypeTableFieldForm } from './PrototypeTableFieldForm'

const getDrawerWidth = (hasTable) => hasTable ? '90%' : 'auto'

const reorderAliases = (name, aliases) => (
  aliases.includes(name)
    ? [name, ...aliases.filter((item) => item !== name)]
    : aliases
)

const mapFieldToFormValues = ({
  name,
  tabularMapping: {
    headerType,
    occurrenceIndex,
    headers,
  },
}) => ({
  name,
  headers: headers.map(({ name, aliases }) => ({
    name,
    aliases: reorderAliases(name, aliases),
  })),
  headerType,
  occurrenceIndex,
})

const PrototypeTableFieldDrawer = ({
  closeDrawer,
  onSave,
  visible,
  field,
}) => {
  const activeTable = useSelector(activeTableSelector)

  const isFieldEditing = !!field

  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
  })

  const {
    getValues,
    formState: {
      isValid,
    },
    reset,
  } = methods

  useEffect(() => {
    field && reset(mapFieldToFormValues(field))
  }, [field, reset])

  const saveField = useCallback(() => {
    onSave(getValues())
  }, [
    getValues,
    onSave,
  ])

  const { headers } = getValues()

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        onClick={closeDrawer}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={!isValid || !headers?.length}
        onClick={saveField}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    closeDrawer,
    isValid,
    saveField,
    headers,
  ])

  const DrawerTitle = useMemo(() => (
    <Title>
      {
        isFieldEditing
          ? localize(Localization.EDIT_TABLE_FIELD)
          : localize(Localization.ADD_TABLE_FIELD)
      }
    </Title>
  ), [isFieldEditing])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onClose={closeDrawer}
      open={visible}
      title={DrawerTitle}
      width={getDrawerWidth(!!activeTable)}
    >
      <FormProvider {...methods}>
        <PrototypeTableFieldForm />
      </FormProvider>
    </Drawer>
  )
}

PrototypeTableFieldDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  field: prototypeTableFieldShape,
}

export {
  PrototypeTableFieldDrawer,
}
