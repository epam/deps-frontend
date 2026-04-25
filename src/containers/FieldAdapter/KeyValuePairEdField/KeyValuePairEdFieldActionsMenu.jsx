
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateExtractedData } from '@/actions/documents'
import { documentsApi } from '@/api/documentsApi'
import { menuItemShape } from '@/components/Menu/CustomMenu'
import { ActionsMenu } from '@/containers/ActionsMenu'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape, KEY_INDEX, VALUE_INDEX } from '@/models/DocumentTypeField'
import {
  EMPTY_FIELD_DATA,
  ExtractedData,
  ExtractedDataField,
  extractedDataFieldShape,
} from '@/models/ExtractedData'
import { documentSelector, idSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { notifyError } from '@/utils/notification'
import { useCommandExtractionProps } from '../useCommandExtractionProps'
import { useFieldProps } from '../useFieldProps'

const KEY_ACTIONS_MENU_KEY = 'key-actions'
const VALUE_ACTIONS_MENU_KEY = 'value-actions'

const { ItemButton } = ActionsMenu

const KeyValuePairEdFieldActionsMenu = ({
  edField,
  disabled,
  dtField,
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

  const isFieldEmpty = (fieldToUpdate, indexToDelete) => (
    Object.entries(fieldToUpdate.data[indexToDelete]).every(([key, val]) => EMPTY_FIELD_DATA[key] === val)
  )
  const isDeleteDisabled = useCallback((indexToDelete) => {
    const { fieldToUpdate } = ExtractedData.getUpdates(document.extractedData, dtField)
    return isFieldEmpty(fieldToUpdate, indexToDelete)
  }, [document.extractedData, dtField])

  const deleteValue = useCallback(async (indexToDelete) => {
    const { extractedDataClone, fieldToUpdate } = ExtractedData.getUpdates(document.extractedData, dtField)
    const fieldIndexToBeSaved = indexToDelete === VALUE_INDEX ? KEY_INDEX : VALUE_INDEX
    const shouldDelete = isFieldEmpty(fieldToUpdate, fieldIndexToBeSaved)
    const updatedField = {
      ...edField,
      data: ExtractedDataField.getEmptyData(dtField),
    }
    updatedField.data[fieldIndexToBeSaved] = fieldToUpdate.data[fieldIndexToBeSaved]
    let modifiedExtractedData

    try {
      if (shouldDelete) {
        modifiedExtractedData = ExtractedData.deleteField(extractedDataClone, fieldToUpdate)
        await documentsApi.deleteEdFields({
          documentPk: documentId,
          fieldPks: [
            fieldToUpdate.fieldPk,
          ],
        })
      } else {
        modifiedExtractedData = ExtractedData.replaceField(extractedDataClone, fieldToUpdate, updatedField)
        await documentsApi.saveEdField({
          aliases: updatedField.aliases,
          data: updatedField.data,
          fieldPk: updatedField.fieldPk,
          documentPk: documentId,
        })
      }

      dispatch(updateExtractedData(documentId, modifiedExtractedData))
    } catch {
      notifyError(localize(Localization.FALLBACK_INFO))
    }
  }, [
    dispatch,
    document.extractedData,
    documentId,
    dtField,
    edField,
  ])

  const keySubMenuItems = useMemo(() => {
    const options = []

    if (ENV.FEATURE_DATA_EXTRACTION) {
      options.push({
        content: () => (
          <ItemButton
            disabled={isExtractionDisabled}
            onClick={() => openExtractAreaModal(KEY_INDEX)}
          >
            {localize(Localization.EXTRACT)}
          </ItemButton>
        ),
      })
    }

    if (dtField.fieldIndex === undefined) {
      options.push({
        content: () => (
          <ItemButton
            disabled={isDeleteDisabled(KEY_INDEX)}
            onClick={() => deleteValue(KEY_INDEX)}
          >
            {localize(Localization.DELETE_DATA)}
          </ItemButton>
        ),
      })
    }

    return options
  }, [
    dtField.fieldIndex,
    isExtractionDisabled,
    openExtractAreaModal,
    isDeleteDisabled,
    deleteValue,
  ])

  const valueSubMenuItems = useMemo(() => {
    const options = []

    if (ENV.FEATURE_DATA_EXTRACTION) {
      options.push({
        content: () => (
          <ItemButton
            disabled={isExtractionDisabled}
            onClick={() => openExtractAreaModal(VALUE_INDEX)}
          >
            {localize(Localization.EXTRACT)}
          </ItemButton>
        ),
      })
    }

    if (dtField.fieldIndex === undefined) {
      options.push({
        content: () => (
          <ItemButton
            disabled={isDeleteDisabled(VALUE_INDEX)}
            onClick={() => deleteValue(VALUE_INDEX)}
          >
            {localize(Localization.DELETE_DATA)}
          </ItemButton>
        ),
      })
    }

    return options
  }, [
    dtField.fieldIndex,
    isExtractionDisabled,
    openExtractAreaModal,
    isDeleteDisabled,
    deleteValue,
  ])

  const commands = useMemo(() => {
    const options = []

    keySubMenuItems.length && options.push({
      key: KEY_ACTIONS_MENU_KEY,
      title: localize(Localization.KEY_ACTIONS),
      children: keySubMenuItems,
    })

    valueSubMenuItems.length && options.push({
      key: VALUE_ACTIONS_MENU_KEY,
      title: localize(Localization.VALUE_ACTIONS),
      children: valueSubMenuItems,
    })

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

    if (extraActions) {
      options.push(...extraActions)
    }

    return options
  }, [
    isRevertDisabled,
    revertValue,
    keySubMenuItems,
    valueSubMenuItems,
    extraActions,
  ])

  return (
    <ActionsMenu
      disabled={disabled}
      items={commands}
    />
  )
}

KeyValuePairEdFieldActionsMenu.propTypes = {
  disabled: PropTypes.bool.isRequired,
  edField: extractedDataFieldShape.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  extraActions: PropTypes.arrayOf(menuItemShape),
}

export {
  KeyValuePairEdFieldActionsMenu,
}
