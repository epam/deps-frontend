
import PropTypes from 'prop-types'
import {
  useMemo,
  useCallback,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { localize, Localization } from '@/localization/i18n'
import { llmExtractorShape } from '@/models/LLMExtractor'
import { LLMSettings } from '@/models/LLMProvider'
import { LLMExtractorForm } from './LLMExtractorForm'
import {
  Modal,
  ModalFooterWrapper,
} from './LLMExtractorModal.styles'

const MODAL_WIDTH = '98%'
const MODAL_HEIGHT = '80%'

const mapLLMExtractorToFieldValues = ({
  name,
  llmReference,
  extractionParams,
}) => {
  const { provider, model } = llmReference
  const {
    customInstruction,
    groupingFactor,
    pageSpan,
    temperature,
    topP,
    contextAttachments,
  } = extractionParams

  return {
    extractorName: name,
    llmModel: LLMSettings.settingsToLLMType(provider, model),
    groupingFactor,
    temperature,
    topP,
    pageSpan,
    customInstruction,
    contextAttachments: contextAttachments ?? '',
  }
}

const LLMExtractorModal = ({
  isLoading,
  isVisible,
  llmExtractor,
  onCancel,
  onSave,
}) => {
  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    ...(llmExtractor && { defaultValues: mapLLMExtractorToFieldValues(llmExtractor) }),
  })

  const {
    getValues,
    formState: {
      isValid,
    },
  } = methods

  const drawerTitle = (
    llmExtractor
      ? localize(Localization.EDIT_LLM_EXTRACTOR)
      : localize(Localization.ADD_LLM_EXTRACTOR)
  )

  const onSubmit = useCallback(async () => {
    const {
      customInstruction,
      extractorName,
      groupingFactor,
      llmModel,
      temperature,
      topP,
      pageSpan,
      contextAttachments,
    } = getValues()

    const { provider, model } = LLMSettings.llmTypeToSettings(llmModel)

    const data = {
      extractorName,
      provider,
      model,
      extractionParams: {
        customInstruction,
        groupingFactor,
        temperature,
        topP,
        ...(pageSpan && { pageSpan }),
        ...(contextAttachments && { contextAttachments }),
      },
    }

    await onSave(data)
  }, [
    getValues,
    onSave,
  ])

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
        onClick={onSubmit}
        type={ButtonType.PRIMARY}
      >
        {
          llmExtractor
            ? localize(Localization.SUBMIT)
            : localize(Localization.CREATE)
        }
      </Button>
    </ModalFooterWrapper>
  ), [
    isLoading,
    isValid,
    llmExtractor,
    onCancel,
    onSubmit,
  ])

  return (
    <Modal
      closable={false}
      destroyOnClose
      footer={ModalFooter}
      getContainer={() => document.body}
      onCancel={onCancel}
      open={isVisible}
      style={
        {
          height: MODAL_HEIGHT,
        }
      }
      title={drawerTitle}
      width={MODAL_WIDTH}
    >
      <FormProvider {...methods}>
        <LLMExtractorForm />
      </FormProvider>
    </Modal>
  )
}

LLMExtractorModal.propTypes = {
  isLoading: PropTypes.bool,
  isVisible: PropTypes.bool.isRequired,
  llmExtractor: llmExtractorShape,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export {
  LLMExtractorModal,
}
