
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { ButtonType, Button } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { GenAIDrivenFieldForm } from './GenAIDrivenFieldForm'
import { Modal, ModalFooterWrapper } from './GenAIDrivenFieldModal.styles'

const MODAL_WIDTH = '98%'
const MODAL_TOP = '2.4rem'
const MODAL_HEIGHT = `calc(100% - ${MODAL_TOP})`

const GenAIDrivenFieldModal = ({
  isLoading,
  onSubmit,
  closeModal,
  visible,
  field,
}) => {
  const documentType = useSelector(documentTypeStateSelector)

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
    reset,
  } = methods

  const saveField = useCallback(async () => {
    await onSubmit(getValues())
    field && reset(getValues())
  }, [
    field,
    reset,
    getValues,
    onSubmit,
  ])

  const ModalFooter = useMemo(() => (
    <ModalFooterWrapper>
      <Button.Secondary
        disabled={isLoading}
        onClick={closeModal}
      >
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Button
        disabled={!isValid}
        loading={isLoading}
        onClick={saveField}
        type={ButtonType.PRIMARY}
      >
        {
          field
            ? localize(Localization.SUBMIT)
            : localize(Localization.CREATE)
        }
      </Button>
    </ModalFooterWrapper>
  ), [
    isLoading,
    closeModal,
    isValid,
    saveField,
    field,
  ])

  const ModalTitle = useMemo(() =>
    field
      ? localize(Localization.EDIT_GEN_AI_DRIVEN_FIELD)
      : localize(Localization.ADD_GEN_AI_DRIVEN_FIELD),
  [field],
  )

  const ModalContent = useMemo(() => (
    <FormProvider {...methods}>
      <GenAIDrivenFieldForm
        field={field}
        handleSubmit={handleSubmit}
        isEditing={!!field}
        llmExtractors={documentType.llmExtractors}
        saveField={saveField}
      />
    </FormProvider>
  ), [
    documentType.llmExtractors,
    field,
    handleSubmit,
    methods,
    saveField,
  ])

  return (
    <Modal
      closable={false}
      destroyOnClose
      footer={ModalFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onCancel={closeModal}
      open={visible}
      style={
        {
          height: MODAL_HEIGHT,
          top: MODAL_TOP,
        }
      }
      title={ModalTitle}
      width={MODAL_WIDTH}
    >
      { ModalContent }
    </Modal>
  )
}

GenAIDrivenFieldModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  field: documentTypeFieldShape,
}

export {
  GenAIDrivenFieldModal,
}
