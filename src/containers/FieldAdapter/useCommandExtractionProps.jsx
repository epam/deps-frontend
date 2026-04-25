
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  extractArea,
  extractAreaWithAlgorithm,
  omrArea,
} from '@/actions/documentReviewPage'
import { updateExtractedData } from '@/actions/documents'
import { documentsApi } from '@/api/documentsApi'
import { UiKeys } from '@/constants/navigation'
import { FieldType } from '@/enums/FieldType'
import { FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { Document } from '@/models/Document'
import {
  ExtractedData,
  ExtractedDataField,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { SourceBboxCoordinates } from '@/models/SourceCoordinates'
import { User } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { documentSelector, idSelector } from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import {
  isAreaExtractingSelector,
  isAreaExtractingWithAlgorithmSelector,
} from '@/selectors/requests'
import { apiMap } from '@/utils/apiMap'
import { ENV } from '@/utils/env'
import { externalOneTimeRender } from '@/utils/externalOneTimeRender'
import { notifyRequest } from '@/utils/notification'
import { RegionAreaPicker } from '../RegionAreaPicker'

const useCommandExtractionProps = (dtField) => {
  const dispatch = useDispatch()
  const document = useSelector(documentSelector)
  const user = useSelector(userSelector)
  const activePage = useSelector(uiSelector)[UiKeys.ACTIVE_PAGE] || 1
  const visiblePdfPage = useSelector(uiSelector)[UiKeys.VISIBLE_PDF_PAGE]
  const documentId = useSelector(idSelector)
  const isAreaFetching = useSelector(isAreaExtractingSelector)
  const isAreaFetchingWithAlgorithm = useSelector(isAreaExtractingWithAlgorithmSelector)

  const openExtractAreaModal = useCallback((fieldId) => new Promise((resolve) => {
    const page = visiblePdfPage ?? activePage
    const blobName = Document.getBlobNameByPage(document, page)
    const imageUrl = apiMap.apiGatewayV2.v5.file.blob(blobName)

    const onOk = async (formattedCoordinates) => {
      let { extractedDataClone, fieldToUpdate } = ExtractedData.getUpdates(document.extractedData, dtField)
      const sourceBboxCoordinates = [
        new SourceBboxCoordinates(
          Document.getBboxSourceIdByPage(document, page),
          page,
          [
            formattedCoordinates,
          ],
        ),
      ]

      const { x, y, w, h } = formattedCoordinates
      const coordinates = new FieldCoordinates(page, x, y, w, h)
      let updatedField = ExtractedDataField.setValue(
        'sourceBboxCoordinates',
        fieldToUpdate,
        sourceBboxCoordinates,
        dtField.fieldIndex,
        fieldId,
      )
      updatedField = ExtractedDataField.setValue(
        'coordinates',
        updatedField,
        coordinates,
        dtField.fieldIndex,
        fieldId,
      )

      try {
        const blobName = Document.getUnifiedDataBlobName(document, page) ?? Document.getProcessingBlobName(document, page)
        const extractAreaCallback = ENV.FEATURE_OCR_INTERSECTION_ALGORITHM ? extractAreaWithAlgorithm : extractArea
        const shouldUseOmrArea = ENV.FEATURE_OMR_AREA && dtField.fieldType === FieldType.CHECKMARK
        const extractCb = shouldUseOmrArea ? omrArea : extractAreaCallback
        const { content, confidence } = await notifyRequest(
          dispatch(extractCb(blobName, formattedCoordinates)),
        )({
          fetching: localize(Localization.FETCHING_EXTRACT_DATA),
          success: localize(Localization.EXTRACT_DATA_SUCCESSFUL),
          warning: localize(Localization.EXTRACT_DATA_FAILED),
        })
        const userName = User.getName(user)
        updatedField = ExtractedDataField.setValue(
          'value', updatedField, content, dtField.fieldIndex, fieldId, userName,
        )
        updatedField = ExtractedDataField.setValue(
          'confidence', updatedField, confidence, dtField.fieldIndex, fieldId, userName,
        )
        await documentsApi.saveEdField({
          aliases: updatedField.aliases,
          data: updatedField.data,
          fieldPk: updatedField.fieldPk,
          documentPk: documentId,
        })
      } finally {
        extractedDataClone = ExtractedData.replaceField(extractedDataClone, fieldToUpdate, updatedField)
        dispatch(updateExtractedData(documentId, extractedDataClone))
        resolve()
      }
    }

    externalOneTimeRender(
      ({ onCancel, onOk }) => (
        <RegionAreaPicker
          fetching={isAreaFetchingWithAlgorithm || isAreaFetching}
          imageUrl={imageUrl}
          message={localize(Localization.REGION_AREA_PICKER_MESSAGE)}
          onCancel={onCancel}
          onOk={onOk}
          title={localize(Localization.REGION_AREA_PICKER_TITLE)}
        />
      ),
      {
        onOk,
      },
    )
  }), [
    document,
    activePage,
    dtField,
    dispatch,
    user,
    documentId,
    isAreaFetching,
    isAreaFetchingWithAlgorithm,
    visiblePdfPage,
  ])

  const isExtractionDisabled = useMemo(() => {
    const isInvalidFileType = dtField.fieldType === FieldType.TABLE
    const isInvalidDocumentExtension = Document.checkExtension(document, FileExtension.DOCX)

    return isInvalidFileType || isInvalidDocumentExtension
  }, [dtField.fieldType, document])

  return {
    openExtractAreaModal,
    isExtractionDisabled,
  }
}

export {
  useCommandExtractionProps,
}
