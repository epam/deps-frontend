
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { updateDocumentsType as updateDocumentsTypeAction } from '@/actions/documentsListPage'
import { documentsApi } from '@/api/documentsApi'
import { Button } from '@/components/Button'
import { MoreIcon } from '@/components/Icons/MoreIcon'
import { CustomMenu } from '@/components/Menu/CustomMenu'
import { Tooltip } from '@/components/Tooltip'
import {
  ALLOW_TO_RETRY_LAST_STEP_STATES,
  FORBIDDEN_STATES_TO_CHANGE_DOCUMENT_TYPE,
  FORBIDDEN_STATES_TO_EXTRACT_DATA,
} from '@/constants/document'
import { ChangeDocumentTypeButton } from '@/containers/ChangeDocumentTypeButton'
import { ExtractData } from '@/containers/ExtractData'
import { RetryPreviousStepButton } from '@/containers/RetryPreviousStepButton'
import { FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { Document, documentShape } from '@/models/Document'
import { UNKNOWN_DOCUMENT_TYPE_PREVIEW_ENTITY } from '@/models/DocumentType'
import { ENV } from '@/utils/env'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { sendRequests } from '@/utils/sendRequests'

export const MoreOptionsCommandMenu = ({
  selectedDocuments,
  className,
}) => {
  const dispatch = useDispatch()

  const getPopupContainer = (trigger) =>
    trigger.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

  const docIdsToChangeType = useMemo(
    () =>
      selectedDocuments
        .filter(
          (item) =>
            !FORBIDDEN_STATES_TO_CHANGE_DOCUMENT_TYPE.includes(item.state),
        )
        .map((item) => item._id) ?? [],
    [selectedDocuments],
  )

  const documentsForExtractData = useMemo(
    () =>
      selectedDocuments?.filter(
        (item) =>
          !(
            FORBIDDEN_STATES_TO_EXTRACT_DATA.includes(item?.state) ||
            FORBIDDEN_STATES_TO_EXTRACT_DATA.includes(item?.error?.inState) ||
            selectedDocuments.some(
              (d) =>
                Document.checkExtension(d, FileExtension.MSG) ||
                Document.checkExtension(d, FileExtension.EML),
            )
          ),
      ),
    [selectedDocuments],
  )

  const updateDocumentsType = useCallback(
    async (type) => {
      const updatedDocuments = await dispatch(
        updateDocumentsTypeAction(type, docIdsToChangeType),
      )

      if (updatedDocuments.length) {
        notifySuccess(
          localize(Localization.UPDATE_DOCUMENTS_TYPE_SUCCESSFUL, {
            count: updatedDocuments.length,
          }),
        )
      } else {
        notifyWarning(
          localize(Localization.UPDATE_DOCUMENTS_TYPE_WARNING, {
            count: docIdsToChangeType.length,
          }),
          localize(Localization.WARNING_DESCRIPTION),
        )
      }
    },
    [dispatch, docIdsToChangeType],
  )

  const documentIdsForExtractData = useMemo(
    () => documentsForExtractData.map((item) => item?._id),
    [documentsForExtractData],
  )

  const disabledExtractData = useMemo(
    () =>
      !documentsForExtractData.length ||
      documentsForExtractData.some(
        (doc) => doc?.documentType === UNKNOWN_DOCUMENT_TYPE_PREVIEW_ENTITY,
      ),
    [documentsForExtractData],
  )

  const disabledChangeType = useMemo(() => {
    const groupIds = new Set(selectedDocuments.map((doc) => doc.groupId))
    const isMultipleGroupIdsSelected = groupIds.size > 1

    return !docIdsToChangeType.length || isMultipleGroupIdsSelected
  }, [docIdsToChangeType, selectedDocuments])

  const docIdsToRetryLastStep = useMemo(
    () =>
      selectedDocuments
        .filter((item) => ALLOW_TO_RETRY_LAST_STEP_STATES.includes(item.state))
        .map((item) => item._id) ?? [],
    [selectedDocuments],
  )

  const disabledRetryLastStep = useMemo(
    () => !docIdsToRetryLastStep.length,
    [docIdsToRetryLastStep],
  )

  const retryLastStepConfirmation = useMemo(() =>
    (selectedDocuments.length > docIdsToRetryLastStep.length) &&
    localize(Localization.BULK_RETRY_LAST_STEP_CONFIRM_CONTENT),
  [
    docIdsToRetryLastStep,
    selectedDocuments,
  ])

  const retryLastStep = useCallback(
    async () => {
      try {
        const requests = docIdsToRetryLastStep.map((id) =>
          async () => await documentsApi.retryLastStep(id),
        )

        await sendRequests(requests, true)

        notifySuccess(localize(Localization.BULK_RETRY_LAST_STEP_SUCCESS))
      } catch {
        notifyWarning(localize(Localization.DEFAULT_ERROR))
      }
    },
    [docIdsToRetryLastStep],
  )

  const renderDropdownItems = useMemo(
    () => {
      const options = []

      if (ENV.FEATURE_DOCUMENT_CHANGE_TYPE) {
        options.push({
          content: () => (
            <ChangeDocumentTypeButton
              disabled={disabledChangeType}
              groupId={selectedDocuments?.[0]?.groupId}
              updateDocumentType={updateDocumentsType}
            >
              {localize(Localization.ASSIGN_DOCUMENT_TYPE)}
            </ChangeDocumentTypeButton>

          ),
        })
      }

      if (ENV.FEATURE_DATA_EXTRACTION) {
        options.push({
          content: () => (
            <ExtractData
              disabled={disabledExtractData}
              documentIds={documentIdsForExtractData}
            >
              {localize(Localization.EXTRACT_DATA)}
            </ExtractData>
          ),
        })
      }

      if (ENV.FEATURE_BULK_RETRY_PREVIOUS_STEP) {
        options.push({
          content: () => (
            <RetryPreviousStepButton
              confirmContent={retryLastStepConfirmation}
              disabled={disabledRetryLastStep}
              retryLastStep={retryLastStep}
            />
          ),
        })
      }

      return options
    }, [
      disabledChangeType,
      disabledExtractData,
      disabledRetryLastStep,
      documentIdsForExtractData,
      retryLastStep,
      retryLastStepConfirmation,
      selectedDocuments,
      updateDocumentsType,
    ])

  return (
    <CustomMenu
      className={className}
      getPopupContainer={getPopupContainer}
      items={renderDropdownItems}
    >
      <Tooltip title={localize(Localization.MORE_OPTIONS)}>
        <Button.Secondary
          icon={<MoreIcon />}
        />
      </Tooltip>
    </CustomMenu>
  )
}

MoreOptionsCommandMenu.propTypes = {
  selectedDocuments: PropTypes.arrayOf(documentShape).isRequired,
  className: PropTypes.string,
}
