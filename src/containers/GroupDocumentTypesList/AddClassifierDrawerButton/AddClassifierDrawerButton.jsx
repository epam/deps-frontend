
import PropTypes from 'prop-types'
import { useCreateGenAiClassifierMutation } from '@/apiRTK/documentTypesGroupsApi'
import { GenAiClassifierDrawer } from '@/containers/GenAiClassifierDrawer'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { PlusIcon, Trigger } from './AddClassifierDrawerButton.styles'

const AddClassifierDrawerButton = ({ documentTypeId }) => {
  const [
    createGenAiClassifier,
    { isLoading },
  ] = useCreateGenAiClassifierMutation()

  const getTrigger = (onClick) => (
    <Trigger
      onClick={onClick}
    >
      <PlusIcon />
      {localize(Localization.ADD_CLASSIFIER)}
    </Trigger>
  )

  const onSubmit = async (values) => {
    try {
      await createGenAiClassifier(values).unwrap()
      notifySuccess(localize(Localization.CREATE_GEN_AI_CLASSIFIER_SUCCESSFUL))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  return (
    <GenAiClassifierDrawer
      documentTypeId={documentTypeId}
      isLoading={isLoading}
      onSubmit={onSubmit}
      renderTrigger={getTrigger}
    />
  )
}

AddClassifierDrawerButton.propTypes = {
  documentTypeId: PropTypes.string.isRequired,
}

export {
  AddClassifierDrawerButton,
}
