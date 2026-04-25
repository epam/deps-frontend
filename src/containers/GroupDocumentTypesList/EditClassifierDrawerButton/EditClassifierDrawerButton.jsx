
import { useUpdateGenAiClassifierMutation } from '@/apiRTK/documentTypesGroupsApi'
import { PenIcon } from '@/components/Icons/PenIcon'
import { TableActionIcon } from '@/components/TableActionIcon'
import { GenAiClassifierDrawer } from '@/containers/GenAiClassifierDrawer'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { genAiClassifierShape } from '@/models/DocumentTypesGroup'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const EditClassifierDrawerButton = ({ classifier }) => {
  const [
    updateGenAiClassifier,
    { isLoading },
  ] = useUpdateGenAiClassifierMutation()

  const getTrigger = (onClick) => (
    <TableActionIcon
      icon={<PenIcon />}
      onClick={onClick}
    />
  )

  const onSubmit = async (values) => {
    const {
      llmType,
      name,
      prompt,
      genAiClassifierId,
    } = values

    try {
      await updateGenAiClassifier({
        genAiClassifierId,
        llmType,
        name,
        prompt,
      }).unwrap()
      notifySuccess(localize(Localization.UPDATE_GEN_AI_CLASSIFIER_SUCCESSFUL))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  return (
    <GenAiClassifierDrawer
      classifier={classifier}
      documentTypeId={classifier.documentTypeId}
      isLoading={isLoading}
      onSubmit={onSubmit}
      renderTrigger={getTrigger}
    />
  )
}

EditClassifierDrawerButton.propTypes = {
  classifier: genAiClassifierShape.isRequired,
}

export {
  EditClassifierDrawerButton,
}
