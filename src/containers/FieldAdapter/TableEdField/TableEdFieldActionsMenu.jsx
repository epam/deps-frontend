
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateExtractedData } from '@/actions/documents'
import { documentsApi } from '@/api/documentsApi'
import { menuItemShape } from '@/components/Menu/CustomMenu'
import { ActionsMenu } from '@/containers/ActionsMenu'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { ExtractedData, ExtractedDataField, extractedDataFieldShape } from '@/models/ExtractedData'
import { documentSelector, idSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { notifyError } from '@/utils/notification'
import { useCommandExtractionProps } from '../useCommandExtractionProps'
import { useFieldProps } from '../useFieldProps'

const { ItemButton } = ActionsMenu

const TableEdFieldActionsMenu = ({
  disabled,
  dtField,
  edField,
  extraActions,
}) => {
  const dispatch = useDispatch()
  const documentId = useSelector(idSelector)
  const document = useSelector(documentSelector)
  const {
    openExtractAreaModal,
    isExtractionDisabled,
  } = useCommandExtractionProps(dtField)
  const {
    revertValue,
    isRevertDisabled,
  } = useFieldProps(dtField, edField)

  const isDeleteDisabled = edField instanceof ExtractedDataField

  const deleteValue = useCallback(async () => {
    const { extractedDataClone, fieldToUpdate } = ExtractedData.getUpdates(document.extractedData, dtField)
    const modifiedExtractedData = ExtractedData.deleteField(extractedDataClone, fieldToUpdate)
    try {
      await documentsApi.deleteEdFields({
        documentPk: documentId,
        fieldPks: [
          fieldToUpdate.fieldPk,
        ],
      })

      dispatch(updateExtractedData(documentId, modifiedExtractedData))
    } catch {
      notifyError(localize(Localization.FALLBACK_INFO))
    }
  }, [dispatch, document.extractedData, documentId, dtField])

  const commands = useMemo(() => {
    const options = []

    if (ENV.FEATURE_DATA_EXTRACTION) {
      options.push({
        content: () => (
          <ItemButton
            disabled={isExtractionDisabled}
            onClick={() => openExtractAreaModal(dtField.fieldId)}
          >
            {localize(Localization.EXTRACT)}
          </ItemButton>
        ),
      })
    }

    options.push({
      content: () => (
        <ItemButton
          disabled={isRevertDisabled}
          onClick={revertValue}
        >
          {localize(Localization.REVERT_TO_PREVIOUS_ACTION)}
        </ItemButton>
      ),
    })

    if (dtField.fieldIndex === undefined) {
      options.push({
        content: () => (
          <ItemButton
            disabled={isDeleteDisabled}
            onClick={deleteValue}
          >
            {localize(Localization.DELETE_DATA)}
          </ItemButton>
        ),
      })
    }

    if (extraActions) {
      options.push(...extraActions)
    }

    return options
  }, [
    dtField.fieldIndex,
    dtField.fieldId,
    isExtractionDisabled,
    openExtractAreaModal,
    isRevertDisabled,
    revertValue,
    isDeleteDisabled,
    deleteValue,
    extraActions,
  ])

  return (
    <ActionsMenu
      disabled={disabled}
      items={commands}
    />
  )
}

TableEdFieldActionsMenu.propTypes = {
  disabled: PropTypes.bool.isRequired,
  edField: extractedDataFieldShape.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  extraActions: PropTypes.arrayOf(menuItemShape),
}

export {
  TableEdFieldActionsMenu,
}
