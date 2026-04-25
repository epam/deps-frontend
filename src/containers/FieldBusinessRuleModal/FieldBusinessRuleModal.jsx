
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ButtonType, Button } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { Localization, localize } from '@/localization/i18n'
import { crossFieldValidatorShape } from '@/models/CrossFieldValidator'
import { FORM_FIELD_CODES, ListMode } from './constants'
import { FieldBusinessRuleForm } from './FieldBusinessRuleForm'
import { Modal, ModalFooterWrapper } from './FieldBusinessRuleModal.styles'

const MODAL_WIDTH = '98%'
const MODAL_TOP = '2.4rem'
const MODAL_HEIGHT = `calc(100% - ${MODAL_TOP})`

const mapFormValuesToRuleDto = ({
  listMode,
  dependentFields = [],
  ...rest
}) => {
  const forEach = listMode === ListMode.FOR_EACH
  const forAny = listMode === ListMode.FOR_ANY

  return {
    ...rest,
    dependentFields,
    forEach,
    forAny,
  }
}

const mapRuleToFormValues = ({
  name,
  severity,
  rule,
  issueMessage,
  forEach,
  forAny,
  validatedFields,
}) => {
  const formValues = {
    [FORM_FIELD_CODES.NAME]: name,
    [FORM_FIELD_CODES.SEVERITY]: severity,
    [FORM_FIELD_CODES.RULE]: rule,
    [FORM_FIELD_CODES.ISSUE_MESSAGE]: issueMessage.message,
    [FORM_FIELD_CODES.VALIDATED_FIELDS]: validatedFields,
    [FORM_FIELD_CODES.DEPENDENT_FIELDS]: issueMessage.dependentFields,
  }

  if (forAny) {
    formValues[FORM_FIELD_CODES.LIST_MODE] = ListMode.FOR_ANY
  }

  if (forEach) {
    formValues[FORM_FIELD_CODES.LIST_MODE] = ListMode.FOR_EACH
  }

  return formValues
}

const FieldBusinessRuleModal = ({
  fieldRule,
  isLoading,
  onSubmit,
  onCancel,
  visible,
}) => {
  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: fieldRule && { ...mapRuleToFormValues(fieldRule) },
  })

  const {
    getValues,
    formState: {
      isValid,
    },
    handleSubmit,
  } = methods

  const handleSaveRule = useCallback(async () => {
    const dto = mapFormValuesToRuleDto(getValues())
    await onSubmit(dto)
  }, [
    getValues,
    onSubmit,
  ])

  const modalTitle = fieldRule ? localize(Localization.EDIT_BUSINESS_RULE) : localize(Localization.CREATE_BUSINESS_RULE)
  const submitButtonTitle = fieldRule ? localize(Localization.SAVE) : localize(Localization.CREATE)

  const ModalFooter = useMemo(() => (
    <ModalFooterWrapper>
      <Button.Secondary
        disabled={isLoading}
        onClick={onCancel}
      >
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Button
        disabled={!isValid}
        loading={isLoading}
        onClick={handleSaveRule}
        type={ButtonType.PRIMARY}
      >
        {submitButtonTitle}
      </Button>
    </ModalFooterWrapper>
  ), [
    isLoading,
    onCancel,
    isValid,
    handleSaveRule,
    submitButtonTitle,
  ])

  return (
    <Modal
      closable={false}
      destroyOnClose
      footer={ModalFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onCancel={onCancel}
      open={visible}
      style={
        {
          height: MODAL_HEIGHT,
          top: MODAL_TOP,
        }
      }
      title={modalTitle}
      width={MODAL_WIDTH}
    >
      <FormProvider {...methods}>
        <FieldBusinessRuleForm
          handleSubmit={handleSubmit}
          onSubmit={handleSaveRule}
        />
      </FormProvider>
    </Modal>
  )
}

FieldBusinessRuleModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fieldRule: crossFieldValidatorShape,
}

export {
  FieldBusinessRuleModal,
}
