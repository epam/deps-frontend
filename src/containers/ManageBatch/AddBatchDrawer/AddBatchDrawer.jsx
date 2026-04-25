
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useCreateBatchMutation } from '@/apiRTK/batchesApi'
import { ButtonType, Button } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { Tooltip } from '@/components/Tooltip'
import {
  CancelButton,
  Drawer,
  DrawerFooterWrapper,
  ResetButton,
} from '@/containers/ManageBatch/ManageBatchLayout.styles'
import { ProgressModal } from '@/containers/ProgressModal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { DEFAULT_FORM_VALUES, FIELD_FORM_CODE } from '../constants'
import { useUploadBatchFiles } from '../useUploadBatchFiles'
import { AddBatchForm } from './AddBatchForm'

const DRAWER_WIDTH_DEFAULT = '60%'

const TEST_ID = {
  SAVE_BUTTON: 'add-batch-drawer-save-button',
  ADD_BATCH_DRAWER: 'add-batch-drawer',
}

const mapDataToBatchDTO = ({ formValues, uploadedData }) => ({
  name: formValues.name,
  groupId: formValues.group?.id,
  files: uploadedData.map((fileData) => ({
    name: fileData.name,
    path: fileData.path,
    documentTypeId: fileData.settings.documentType,
    processingParams: {
      engine: fileData.settings.engine,
      llmType: fileData.settings.llmType,
      parsingFeatures: fileData.settings.parsingFeatures,
    },
  })),
})

export const AddBatchDrawer = ({ isVisible, onClose }) => {
  const [isUploading, setIsUploading] = useState(false)

  const formApi = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const formValues = formApi.watch()

  const {
    uploadFiles,
    completedRequests,
    resetRequestsCounter,
  } = useUploadBatchFiles()

  const [createBatch] = useCreateBatchMutation()

  const createBatchHandler = useCallback(async (uploadedData, formValues) => {
    try {
      const data = mapDataToBatchDTO({
        formValues,
        uploadedData,
      })

      await createBatch(data).unwrap()
      notifySuccess(localize(Localization.BATCH_WAS_CREATED))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }, [createBatch])

  const submitData = useCallback(async () => {
    setIsUploading(true)

    const values = formApi.getValues()
    const uploadedData = await uploadFiles(values[FIELD_FORM_CODE.FILES])

    uploadedData && await createBatchHandler(uploadedData, values)

    setIsUploading(false)
    resetRequestsCounter()
  }, [
    formApi,
    uploadFiles,
    createBatchHandler,
    resetRequestsCounter,
  ])

  const hasGroup = ENV.FEATURE_DOCUMENT_TYPES_GROUPS && !!formValues.group?.id
  const allFilesHaveDocumentType = formValues.files?.every((f) => !!f?.settings?.documentType)
  const meetsGroupOrDocTypeConstraint = !formValues.files?.length || hasGroup || allFilesHaveDocumentType
  const isSaveDisabled = !formValues.files?.length || isUploading || !formValues.name?.trim() || !meetsGroupOrDocTypeConstraint

  const uploadButtonTooltip = !meetsGroupOrDocTypeConstraint && formValues.files?.length
    ? localize(Localization.SELECT_DOCUMENT_TYPE_OR_GROUP_REQUIRED)
    : undefined

  const onReset = useCallback(() => {
    formApi.reset({
      ...DEFAULT_FORM_VALUES,
      files: formValues.files,
    })
  }, [formApi, formValues.files])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <ResetButton onClick={onReset}>
        {localize(Localization.RESET_SETTINGS)}
      </ResetButton>
      <CancelButton onClick={onClose}>
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Tooltip title={uploadButtonTooltip}>
        <Button
          data-testid={TEST_ID.SAVE_BUTTON}
          disabled={isSaveDisabled}
          onClick={submitData}
          type={ButtonType.PRIMARY}
        >
          {localize(Localization.UPLOAD)}
        </Button>
      </Tooltip>
    </DrawerFooterWrapper>
  ), [
    onReset,
    onClose,
    isSaveDisabled,
    submitData,
    uploadButtonTooltip,
  ])

  return (
    <>
      <Drawer
        data-testid={TEST_ID.ADD_BATCH_DRAWER}
        destroyOnClose
        footer={DrawerFooter}
        getContainer={() => document.body}
        hasCloseIcon={false}
        onClose={onClose}
        open={isVisible}
        title={localize(Localization.BATCH_SETTINGS)}
        width={DRAWER_WIDTH_DEFAULT}
      >
        <FormProvider {...formApi}>
          <AddBatchForm />
        </FormProvider>
      </Drawer>
      {
        isUploading && (
          <ProgressModal
            current={completedRequests}
            total={formValues.files.length}
          />
        )
      }
    </>
  )
}

AddBatchDrawer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
