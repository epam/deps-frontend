
import { useDeleteGenAiClassifierMutation } from '@/apiRTK/documentTypesGroupsApi'
import { LongText } from '@/components/LongText'
import { Modal } from '@/components/Modal'
import { Tag } from '@/components/Tag'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { genAiClassifierShape } from '@/models/DocumentTypesGroup'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const ClassifierTag = ({ classifier }) => {
  const [deleteGenAiClassifier] = useDeleteGenAiClassifierMutation()

  const handleRemove = async () => {
    try {
      await deleteGenAiClassifier([classifier.genAiClassifierId]).unwrap()
      notifySuccess(localize(Localization.CLASSIFIER_SUCCESS_DELETION, {
        name: classifier.name,
      }))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  const onRemoveClick = () => {
    Modal.confirm({
      title: localize(Localization.DELETE_CLASSIFIER_CONFIRM_MESSAGE, {
        name: classifier.name,
      }),
      onOk: handleRemove,
    })
  }

  return (
    <Tag onClose={onRemoveClick}>
      <LongText text={classifier.name} />
    </Tag>
  )
}

ClassifierTag.propTypes = {
  classifier: genAiClassifierShape.isRequired,
}

export {
  ClassifierTag,
}
