
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setHighlightedField as setHighlightedFieldAction,
  setActiveField,
  highlightPolygonCoordsField,
  highlightTextCoordsField,
  highlightTableCoordsField,
} from '@/actions/documentReviewPage'
import { updateExtractedData, storeValidation } from '@/actions/documents'
import { documentsApi } from '@/api/documentsApi'
import { documentTypesApi } from '@/api/documentTypesApi'
import { MAX_CONFIDENCE_LEVEL } from '@/constants/confidence'
import { UiKeys } from '@/constants/navigation'
import { FieldType } from '@/enums/FieldType'
import {
  ExtractedData,
  ExtractedDataField,
  ListField,
} from '@/models/ExtractedData'
import { HighlightedField } from '@/models/HighlightedField'
import { SourceBboxCoordinates, SourceTableCoordinates, SourceTextCoordinates } from '@/models/SourceCoordinates'
import { mapSourceTableCoordinatesToTableCoordinates } from '@/models/SourceCoordinates/mappers'
import { User } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { documentSelector, documentTypeSelector, idSelector, highlightedFieldSelector } from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { ENV } from '@/utils/env'
import { maskExcessChars } from '@/utils/string'

const useFieldProps = (dtField, edField) => {
  const dispatch = useDispatch()
  const document = useSelector(documentSelector)
  const documentType = useSelector(documentTypeSelector)
  const user = useSelector(userSelector)
  const activePage = useSelector(uiSelector)[UiKeys.ACTIVE_PAGE]
  const documentId = useSelector(idSelector)
  const highlightedField = useSelector(highlightedFieldSelector)

  const isMultiSourceCoordinates = useCallback(
    (edField) => {
      const {
        sourceBboxCoordinates,
        sourceTableCoordinates,
        sourceTextCoordinates,
      } = edField.data

      return (
        (
          sourceBboxCoordinates &&
          (
            !SourceBboxCoordinates.areCoordinatesFromSingleSource(sourceBboxCoordinates) &&
            SourceBboxCoordinates.isMultiCoordinates(sourceBboxCoordinates)
          )
        ) ||
        (
          sourceTableCoordinates &&
          SourceTableCoordinates.isMultiCoordinates(sourceTableCoordinates)
        ) ||
        (
          sourceTextCoordinates &&
          SourceTextCoordinates.isMultiCoordinates(sourceTextCoordinates)
        )
      )
    }, [],
  )

  const isMultiCoordinates = useCallback(
    (edField) => {
      const {
        coordinates,
        tableCoordinates,
        sourceBboxCoordinates,
        sourceTableCoordinates,
        sourceTextCoordinates,
      } = edField.data

      if (
        sourceBboxCoordinates ||
        sourceTableCoordinates ||
        sourceTextCoordinates
      ) {
        return isMultiSourceCoordinates(edField)
      }

      return (
        (
          coordinates &&
          coordinates.length > 1 &&
          !coordinates.every((coord, _, self) => coord.page === self[0].page)
        ) ||
        (
          tableCoordinates?.length > 1 ||
          tableCoordinates?.[0]?.cellRange?.length > 1
        )
      )
    }, [isMultiSourceCoordinates],
  )

  const onChangeData = useCallback(async (newValue) => {
    let { extractedDataClone, fieldToUpdate } = ExtractedData.getUpdates(document.extractedData, dtField)
    const valueBefore = fieldToUpdate.data?.[dtField.fieldIndex]?.value ?? fieldToUpdate.data?.value
    if (valueBefore === newValue) {
      return
    }
    const userName = User.getName(user)
    const updatedWithValue =
      ExtractedDataField.setValue(
        'value',
        fieldToUpdate,
        newValue,
        dtField.fieldIndex,
        dtField.fieldId,
        userName,
      )
    const updatedWithConfidence = ExtractedDataField.setValue(
      'confidence',
      updatedWithValue,
      MAX_CONFIDENCE_LEVEL,
      dtField.fieldIndex,
      dtField.fieldId,
      userName,
    )
    extractedDataClone = ExtractedData.replaceField(extractedDataClone, fieldToUpdate, updatedWithConfidence)
    dispatch(updateExtractedData(documentId, extractedDataClone))

    await documentsApi.saveEdField({
      aliases: updatedWithConfidence.aliases,
      data: updatedWithConfidence.data,
      fieldPk: updatedWithConfidence.fieldPk,
      documentPk: documentId,
    })

    if (ENV.FEATURE_PER_FIELD_VALIDATION) {
      const validationResult = await documentTypesApi.validateField(
        documentType.code,
        dtField.code,
        documentId,
      )

      dispatch(storeValidation(documentId, validationResult))
    }
  }, [document.extractedData, dtField, user, dispatch, documentId, documentType.code])

  const highlightArea = useCallback(
    (field, page, sourceId) => {
      const {
        coordinates,
        tableCoordinates,
        sourceBboxCoordinates,
        sourceTableCoordinates,
        sourceTextCoordinates,
      } = edField.data

      if (sourceBboxCoordinates || coordinates) {
        dispatch(highlightPolygonCoordsField({
          field,
          sourceId,
          ...(!sourceId && { page }),
        }))
      }

      if (sourceTableCoordinates || tableCoordinates?.length) {
        dispatch(highlightTableCoordsField({
          field,
          sourceId,
          ...(!sourceId && { page }),
        }))
      }

      if (sourceTextCoordinates) {
        dispatch(highlightTextCoordsField({
          field,
          sourceId,
        }))
      }
    }, [
      dispatch,
      edField.data,
    ],
  )

  const highlightFirstSourceCoords = useCallback(
    () => {
      const {
        sourceTableCoordinates,
        sourceBboxCoordinates,
        sourceTextCoordinates,
      } = edField.data
      const [highlightedCoordinates] = highlightedField ?? []

      if (
        !sourceBboxCoordinates &&
        !sourceTableCoordinates &&
        !sourceTextCoordinates
      ) {
        return
      }

      let isEqualToHighlighted

      if (sourceBboxCoordinates) {
        isEqualToHighlighted = (
          !!highlightedField?.length &&
          sourceBboxCoordinates.map((coords) => coords.bboxes).flat()?.find((coord) => (
            isEqual(highlightedCoordinates, coord)
          ))
        )
      }

      if (sourceTableCoordinates) {
        isEqualToHighlighted = (
          !!highlightedField?.length &&
          sourceTableCoordinates.map((coords) => coords.cellRanges).flat()?.find((coord) => (
            isEqual(highlightedCoordinates, mapSourceTableCoordinatesToTableCoordinates(coord))
          ))
        )
      }

      if (sourceTextCoordinates) {
        isEqualToHighlighted = (
          sourceTextCoordinates.map((coords) => coords.charRanges).flat()?.every((coord, indx) => {
            return isEqual(highlightedCoordinates?.[indx], coord)
          }) && (
            highlightedField === sourceTextCoordinates[0].sourceId
          )
        )
      }

      if (!isEqualToHighlighted) {
        const [firstCoord] = (
          sourceBboxCoordinates ??
          sourceTableCoordinates ??
          sourceTextCoordinates
        )

        const coord = (
          firstCoord.bboxes?.[0] ??
          mapSourceTableCoordinatesToTableCoordinates(firstCoord.cellRanges?.[0]) ??
          firstCoord.charRanges
        )
        coord && highlightArea([coord], null, firstCoord.sourceId)
      }
    }, [edField, highlightArea, highlightedField],
  )

  const highlightFirstCoords = useCallback(
    () => {
      const {
        coordinates,
        tableCoordinates,
        sourceBboxCoordinates,
        sourceTableCoordinates,
        sourceTextCoordinates,
      } = edField.data

      const [highlightedCoordinates] = highlightedField?.length === 1 ? highlightedField : []

      if (
        sourceBboxCoordinates ||
        sourceTableCoordinates ||
        sourceTextCoordinates
      ) {
        highlightFirstSourceCoords()
        return
      }

      let isEqualToHighlighted

      if (!tableCoordinates && coordinates) {
        isEqualToHighlighted = coordinates.find((coord) => {
          const coordWithoutPage = omit(coord, 'page')
          return isEqual({ ...highlightedCoordinates }, coordWithoutPage)
        })
      }

      if (!coordinates && tableCoordinates) {
        isEqualToHighlighted = tableCoordinates.map((coord) => coord.cellRange).flat().find((coord) => (
          isEqual(highlightedCoordinates, coord)
        ))
      }

      if (!isEqualToHighlighted) {
        const [coords] = coordinates ?? []
        const [tableCoords] = tableCoordinates ?? []
        const neededCoordinates = coordinates ? omit(coords, 'page') : tableCoords?.cellRange[0]
        const page = coordinates ? coords?.page : tableCoords?.page
        highlightArea([neededCoordinates], page ?? activePage)
      }
    }, [
      edField,
      highlightedField,
      highlightFirstSourceCoords,
      highlightArea,
      activePage,
    ],
  )

  const setHighlightedField = useCallback(() => {
    if (!ExtractedDataField.hasCoordinates(edField.data)) {
      dispatch(setHighlightedFieldAction(null))
      return
    }

    if (!isMultiCoordinates(edField)) {
      const newHighlightedField = HighlightedField.getHighlightedField(dtField, edField, highlightedField)
      highlightArea(newHighlightedField?.field, newHighlightedField?.page ?? activePage, newHighlightedField?.sourceId)
    } else {
      highlightFirstCoords()
    }
  }, [
    edField,
    isMultiCoordinates,
    dispatch,
    dtField,
    highlightedField,
    highlightArea,
    activePage,
    highlightFirstCoords,
  ])

  const onFocus = useCallback(() => {
    setHighlightedField()
    dispatch(setActiveField(dtField.pk))
  }, [setHighlightedField, dispatch, dtField.pk])

  const setField = useCallback((newEdField) => {
    let { extractedDataClone, fieldToUpdate } = ExtractedData.getUpdates(document.extractedData, dtField)
    extractedDataClone = ExtractedData.replaceField(extractedDataClone, fieldToUpdate, newEdField)
    dispatch(updateExtractedData(documentId, extractedDataClone))
  }, [dispatch, document.extractedData, documentId, dtField])

  const revertValue = useCallback(() => {
    const { extractedDataClone, fieldToUpdate } = ExtractedData.getUpdates(document.extractedData, dtField)
    const initialDocumentData = document.initialDocumentData
    const initialField = ExtractedData.getFieldByPk(initialDocumentData.extractedData, dtField.pk)
    let updatedField
    if (Array.isArray(fieldToUpdate.data)) {
      const initialSubField = ListField.getSubFieldById(initialField, edField.data.id)
      updatedField = ListField.replaceSubField(fieldToUpdate, edField, initialSubField)
    }
    const updatedExtractedData = ExtractedData.replaceField(extractedDataClone, fieldToUpdate, updatedField || initialField)
    dispatch(updateExtractedData(documentId, updatedExtractedData))
  }, [
    edField,
    document.extractedData,
    document.initialDocumentData,
    dtField,
    dispatch,
    documentId,
  ])

  const isRevertDisabled = useMemo(() => {
    const initialDocumentData = document.initialDocumentData
    const initialField = ExtractedData.getFieldByPk(initialDocumentData.extractedData, dtField.pk)

    return (
      dtField.fieldType === FieldType.TABLE ||
      !initialField ||
      (dtField.fieldIndex !== undefined && !ListField.getSubFieldById(initialField, edField.data.id))
    )
  }, [
    edField.data.id,
    dtField.fieldType,
    dtField.pk,
    document.initialDocumentData,
    dtField.fieldIndex,
  ])

  const getValueToDisplay = useCallback((displayCharLimit) => {
    const value = ExtractedDataField.getValue(edField)

    if (
      !ENV.FEATURE_FIELDS_DISPLAY_MODE ||
      !dtField.confidential
    ) {
      return value
    }

    return maskExcessChars(displayCharLimit, value)
  }, [
    dtField.confidential,
    edField,
  ])

  return {
    highlightArea,
    isRevertDisabled,
    onChangeData,
    onFocus,
    revertValue,
    setField,
    setHighlightedField,
    getValueToDisplay,
  }
}

export {
  useFieldProps,
}
