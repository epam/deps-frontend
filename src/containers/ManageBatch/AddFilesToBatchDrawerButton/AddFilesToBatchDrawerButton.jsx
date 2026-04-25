
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useUploadFilesToBatchMutation, useFetchBatchQuery } from '@/apiRTK/batchesApi'
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
import { AddFilesForm } from './AddFilesForm'

const DRAWER_WIDTH_DEFAULT = '62%'

const TEST_ID = {
  SAVE_BUTTON: 'add-files-drawer-save-button',
  ADD_FILES_BUTTON: 'add-files-drawer-add-files-button',
}

const mapDataToBatchFilesDTO = ({ uploadedData }) => ({
  files: uploadedData.map((fileData) => ({
    path: fileData.path,
    name: fileData.name,
    documentTypeId: fileData.settings?.documentType,
    processingParams: {
      engine: fileData.settings?.engine,
      language: fileData.settings?.language,
      llmType: fileData.settings?.llmType,
      parsingFeatures: fileData.settings?.parsingFeatures,
    },
  })),
})

export const AddFilesToBatchDrawerButton = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const { id } = useParams()

  const { data: batch } = useFetchBatchQuery(id)

  const formApi = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const {
    uploadFiles,
    completedRequests,
    resetRequestsCounter,
  } = useUploadBatchFiles()

  const [
    uploadFilesToBatch,
    {
      isLoading: isUploading,
    },
  ] = useUploadFilesToBatchMutation()

  const toggleDrawer = useCallback(() => {
    if (isFetching || isUploading) {
      return
    }
    setIsDrawerVisible((prev) => !prev)
  }, [isFetching, isUploading])

  const uploadFilesToBatchHandler = useCallback(async (uploadedData, formValues) => {
    try {
      const batchData = mapDataToBatchFilesDTO({
        formValues,
        uploadedData,
      })

      await uploadFilesToBatch({
        batchId: batch.id,
        files: batchData.files,
      }).unwrap()

      notifySuccess(localize(Localization.FILES_UPLOADED_SUCCESSFULLY))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }, [batch.id, uploadFilesToBatch])

  const submitData = useCallback(async () => {
    setIsFetching(true)

    const formValues = formApi.getValues()
    const uploadedData = await uploadFiles(formValues[FIELD_FORM_CODE.FILES])

    uploadedData && await uploadFilesToBatchHandler(uploadedData, formValues)

    setIsFetching(false)
    resetRequestsCounter()
    toggleDrawer()
  }, [
    formApi,
    uploadFiles,
    uploadFilesToBatchHandler,
    resetRequestsCounter,
    toggleDrawer,
  ])

  const formValues = formApi.watch()

  const hasGroup = ENV.FEATURE_DOCUMENT_TYPES_GROUPS && !!batch?.group?.id
  const allFilesHaveDocumentType = formValues.files?.every((f) => !!f?.settings?.documentType)
  const meetsGroupOrDocTypeConstraint = !formValues.files?.length || hasGroup || allFilesHaveDocumentType

  const isSaveDisabled = !formValues.files?.length || isFetching || isUploading || !meetsGroupOrDocTypeConstraint

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
      <ResetButton
        onClick={onReset}
      >
        {localize(Localization.RESET_SETTINGS)}
      </ResetButton>
      <CancelButton
        onClick={toggleDrawer}
      >
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
    isSaveDisabled,
    onReset,
    submitData,
    toggleDrawer,
    uploadButtonTooltip,
  ])

  return (
    <>
      <Button
        data-testid={TEST_ID.ADD_FILES_BUTTON}
        onClick={toggleDrawer}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.UPLOAD_BATCH_FILES)}
      </Button>
      {
        isDrawerVisible && (
          <Drawer
            destroyOnClose
            footer={DrawerFooter}
            hasCloseIcon={false}
            onClose={toggleDrawer}
            open={isDrawerVisible}
            title={localize(Localization.BATCH_SETTINGS)}
            width={DRAWER_WIDTH_DEFAULT}
          >
            <FormProvider {...formApi}>
              <AddFilesForm />
            </FormProvider>
          </Drawer>
        )
      }
      {
        isFetching && (
          <ProgressModal
            current={completedRequests}
            total={formValues.files.length}
          />
        )
      }
    </>
  )
}
