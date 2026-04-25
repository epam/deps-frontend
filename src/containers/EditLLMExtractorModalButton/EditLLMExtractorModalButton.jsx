
import PropTypes from 'prop-types'
import {
  useState,
  useCallback,
} from 'react'
import {
  useUpdateLLMExtractorMutation,
  useUpdateExtractorLLMReferenceMutation,
} from '@/apiRTK/documentTypeApi'
import { LLMExtractorModal } from '@/containers/LLMExtractorModal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { llmExtractorShape } from '@/models/LLMExtractor'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const EditLLMExtractorModalButton = ({
  documentTypeId,
  llmExtractor,
  onAfterEditing,
  renderTrigger,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleModal = useCallback(() => {
    setIsVisible((prevIsVisible) => !prevIsVisible)
  }, [setIsVisible])

  const [
    updateLLMExtractor,
    { isLoading: isLLMExtractorUpdating },
  ] = useUpdateLLMExtractorMutation()

  const [
    updateExtractorLLMReference,
    { isLoading: isExtractorLLMReferenceUpdating },
  ] = useUpdateExtractorLLMReferenceMutation()

  const updateExtractor = useCallback(async (formData) => {
    try {
      const { extractorName, extractionParams, provider, model } = formData

      await updateLLMExtractor({
        documentTypeId,
        extractorId: llmExtractor.extractorId,
        data: {
          name: extractorName,
          extractionParams: {
            ...extractionParams,
            ...(!extractionParams.pageSpan && { pageSpan: null }),
          },
        },
      }).unwrap()

      await updateExtractorLLMReference({
        documentTypeId,
        extractorId: llmExtractor.extractorId,
        data: {
          model,
          provider,
        },
      }).unwrap()

      notifySuccess(localize(Localization.LLM_EXTRACTOR_SUCCESS_UPDATING))
      toggleModal()
      await onAfterEditing()
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }, [
    documentTypeId,
    llmExtractor.extractorId,
    updateLLMExtractor,
    updateExtractorLLMReference,
    onAfterEditing,
    toggleModal,
  ])

  return (
    <>
      {renderTrigger(toggleModal)}
      <LLMExtractorModal
        isLoading={isLLMExtractorUpdating || isExtractorLLMReferenceUpdating}
        isVisible={isVisible}
        llmExtractor={llmExtractor}
        onCancel={toggleModal}
        onSave={updateExtractor}
      />
    </>
  )
}

EditLLMExtractorModalButton.propTypes = {
  documentTypeId: PropTypes.string.isRequired,
  llmExtractor: llmExtractorShape.isRequired,
  onAfterEditing: PropTypes.func.isRequired,
  renderTrigger: PropTypes.func.isRequired,
}

export {
  EditLLMExtractorModalButton,
}
