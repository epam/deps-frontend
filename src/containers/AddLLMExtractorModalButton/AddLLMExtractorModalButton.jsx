
import PropTypes from 'prop-types'
import {
  useState,
  useCallback,
} from 'react'
import { useCreateLLMExtractorMutation } from '@/apiRTK/documentTypeApi'
import { LLMExtractorModal } from '@/containers/LLMExtractorModal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const AddLLMExtractorModalButton = ({
  documentTypeName,
  onAfterAdding,
  renderTrigger,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleModal = useCallback(() => {
    setIsVisible((prevIsVisible) => !prevIsVisible)
  }, [setIsVisible])

  const [
    createLLMExtractor,
    { isLoading },
  ] = useCreateLLMExtractorMutation()

  const saveExtractor = useCallback(async (data) => {
    try {
      await createLLMExtractor({
        documentTypeName,
        ...data,
      }).unwrap()
      notifySuccess(localize(Localization.LLM_EXTRACTOR_SUCCESS_CREATION))
      toggleModal()
      await onAfterAdding()
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }, [
    createLLMExtractor,
    documentTypeName,
    onAfterAdding,
    toggleModal,
  ])

  return (
    <>
      {renderTrigger(toggleModal)}
      <LLMExtractorModal
        isLoading={isLoading}
        isVisible={isVisible}
        onCancel={toggleModal}
        onSave={saveExtractor}
      />
    </>
  )
}

AddLLMExtractorModalButton.propTypes = {
  documentTypeName: PropTypes.string.isRequired,
  onAfterAdding: PropTypes.func.isRequired,
  renderTrigger: PropTypes.func.isRequired,
}

export {
  AddLLMExtractorModalButton,
}
