
import { useState } from 'react'
import { fetchTemplateMarkupState, fetchTemplateVersions } from '@/api/templatesApi'
import { ButtonType } from '@/components/Button'
import { Spin } from '@/components/Spin'
import { ASYNC_OPERATION_STATE } from '@/enums/AsyncOperationState'
import { ExtractionType } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import {
  notifyInfo,
  notifyProgress,
  notifyWarning,
} from '@/utils/notification'
import { goTo } from '@/utils/routerActions'
import { EditButton } from './EditDocumentTypeButton.styles'

const EditDocumentTypeButton = ({
  documentType,
}) => {
  const [areVersionsFetching, setAreVersionsFetching] = useState(false)

  const goToLabelingTool = async (id) => {
    let stopNotification
    try {
      setAreVersionsFetching(true)
      const versions = await fetchTemplateVersions(id)

      if (ENV.FEATURE_AUTO_LABELING) {
        stopNotification = notifyProgress(localize(Localization.AUTO_MARKUP_CHECKING))
        const status = await fetchTemplateMarkupState(id)

        if (status === ASYNC_OPERATION_STATE.PROCESSING) {
          return notifyInfo(localize(Localization.AUTO_MARKUP_IN_PROGRESS))
        }

        return goTo(navigationMap.templates.labelingTool(id, versions.at(-1).id))
      }

      return goTo(navigationMap.templates.labelingTool(id, versions.at(-1).id))
    } catch (err) {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      stopNotification?.()
      setAreVersionsFetching(false)
    }
  }

  const editTemplate = async (templateId) => {
    if (ENV.FEATURE_MANAGE_TEMPLATE_VERSIONS) {
      return goTo(navigationMap.templates.template(templateId))
    }

    await goToLabelingTool(templateId)
  }

  const onEditDocumentTypeClick = () => {
    if (documentType.extractionType === ExtractionType.TEMPLATE) {
      return editTemplate(documentType.code)
    }

    if (documentType.extractionType === ExtractionType.PROTOTYPE) {
      return goTo(navigationMap.prototypes.prototype(documentType.code))
    }
  }

  return (
    <Spin spinning={areVersionsFetching}>
      <EditButton
        onClick={onEditDocumentTypeClick}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.EDIT_DOCUMENT_TYPE)}
      </EditButton>
    </Spin>
  )
}

EditDocumentTypeButton.propTypes = {
  documentType: documentTypeShape.isRequired,
}

export {
  EditDocumentTypeButton,
}
