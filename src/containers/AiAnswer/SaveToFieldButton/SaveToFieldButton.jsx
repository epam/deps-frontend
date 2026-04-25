
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { createField } from '@/actions/genAiData'
import { CommentPlusIcon } from '@/components/Icons/CommentPlusIcon'
import { AddDocumentSupplementDrawer } from '@/containers/AddDocumentSupplementDrawer'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { documentSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { notifyRequest } from '@/utils/notification'
import { IconButton } from './SaveToFieldButton.styles'

const SAVE_TO_FIELD_TOOLTIP = {
  title: localize(Localization.SAVE_AI_RESPONSE_TO_FIELD),
}

const getFieldToCreate = (value) => (
  new DocumentSupplement({
    code: uuidv4(),
    name: '',
    type: FieldType.STRING,
    value,
  })
)

const SaveToFieldButton = ({
  prompt,
  answer,
}) => {
  const dispatch = useDispatch()
  const [isAddFieldDrawerVisible, setIsAddFieldDrawerVisible] = useState(false)

  const {
    _id: documentId,
    documentType,
  } = useSelector(documentSelector)

  const createdGenAiKeyValueField = async () => {
    await notifyRequest(dispatch(createField({
      key: prompt,
      value: answer,
    })))({
      success: localize(Localization.CREATE_GEN_AI_FIELD_MESSAGE),
      warning: localize(Localization.DEFAULT_ERROR),
      fetching: localize(Localization.CREATE_GEN_AI_FIELD_MESSAGE_IN_PROGRESS),
    })
  }

  const saveToField = async () => {
    if (ENV.FEATURE_GEN_AI_KEY_VALUE_FIELDS) {
      await createdGenAiKeyValueField()
      return
    }

    if (ENV.FEATURE_ENRICHMENT) {
      setIsAddFieldDrawerVisible(true)
    }
  }

  const hideDrawer = () => {
    setIsAddFieldDrawerVisible(false)
  }

  return (
    <>
      <IconButton
        icon={<CommentPlusIcon />}
        onClick={saveToField}
        tooltip={SAVE_TO_FIELD_TOOLTIP}
      />
      <AddDocumentSupplementDrawer
        documentId={documentId}
        documentTypeCode={documentType.code}
        field={getFieldToCreate(answer)}
        genAiPrompt={prompt}
        isDrawerVisible={isAddFieldDrawerVisible}
        toggleDrawer={hideDrawer}
      />
    </>
  )
}

SaveToFieldButton.propTypes = {
  prompt: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
}

export {
  SaveToFieldButton,
}
