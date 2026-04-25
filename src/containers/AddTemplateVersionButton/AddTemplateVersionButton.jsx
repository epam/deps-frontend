
import { useCallback, useState, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { Button, ButtonType } from '@/components/Button'
import { UploadIcon } from '@/components/Icons/UploadIcon'
import { TemplatePicker } from '@/containers/TemplatePicker'
import { UploadStatus } from '@/enums/UploadStatus'
import { localize, Localization } from '@/localization/i18n'
import { TemplateVersionUploadService } from '@/services/TemplateVersionUploadService'
import { getFileSizeStr } from '@/utils/file'
import { notifySuccess, notifyError } from '@/utils/notification'
import {
  CancelButton,
  DrawerFooterWrapper,
  DrawerHeaderWrapper,
  DrawerButton,
  Drawer,
  PlusIcon,
} from './AddTemplateVersionButton.styles'
import { AddTemplateVersionForm } from './AddTemplateVersionForm'

const AddTemplateVersionButton = () => {
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false)
  const [file, setFile] = useState(null)
  const [uploadState, setUploadState] = useState({})

  const { id } = useParams()

  const methods = useForm({
    shouldUnregister: true,
    defaultValues: {
      description: '',
    },
  })
  const { getValues } = methods

  const isFileUploading = uploadState.status === UploadStatus.PENDING
  const isUploadDisabled = isFileUploading || !file

  const getContainer = useCallback(() => document.body, [])

  const onFileUploadSuccess = useCallback(() => {
    setUploadState((prevState) => ({
      ...prevState,
      status: UploadStatus.SUCCESS,
    }))
    notifySuccess(localize(Localization.ALL_UPLOADS_SUCCESS_STATUS))
  }, [setUploadState])

  const onFileUploadError = useCallback(() => {
    setUploadState((prevState) => ({
      ...prevState,
      status: UploadStatus.FAILURE,
    }))

    notifyError(localize(Localization.ALL_TEMPLATE_UPLOADS_FAILURE_STATUS))
  }, [setUploadState])

  const onFileUploadProgress = useCallback((file, { percent, cancelToken }) => {
    setUploadState((prevState) => ({
      ...prevState,
      status: UploadStatus.PENDING,
      name: file.name,
      size: getFileSizeStr(file.size),
      percent: Math.round(percent),
      cancelToken,
    }))
  }, [setUploadState])

  const toggleVisibility = useCallback(() => {
    setIsVisibleDrawer((prev) => !prev)
    setFile(null)
  }, [])

  const uploadTemplateVersion = useCallback(
    async () => {
      const uploader = new TemplateVersionUploadService(
        onFileUploadSuccess,
        onFileUploadError,
        onFileUploadProgress,
      )
      const formValues = getValues()

      await uploader.uploadTemplateVersion({
        templateId: id,
        file,
        name: file.name,
        description: formValues.description,
      })
      toggleVisibility()
    },
    [
      toggleVisibility,
      file,
      id,
      onFileUploadSuccess,
      onFileUploadError,
      onFileUploadProgress,
      getValues,
    ])

  const DrawerTitle = useMemo(() => (
    <DrawerHeaderWrapper>
      <UploadIcon />
      {localize(Localization.ADD_NEW_TEMPLATE_VERSION)}
    </DrawerHeaderWrapper>
  ), [])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isFileUploading}
        onClick={toggleVisibility}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={isUploadDisabled}
        loading={isFileUploading}
        onClick={uploadTemplateVersion}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.UPLOAD)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    uploadTemplateVersion,
    toggleVisibility,
    isFileUploading,
    isUploadDisabled,
  ])

  return (
    <>
      <Drawer
        destroyOnClose
        footer={DrawerFooter}
        getContainer={getContainer}
        hasCloseIcon={false}
        onClose={toggleVisibility}
        open={isVisibleDrawer}
        title={DrawerTitle}

      >
        <FormProvider {...methods}>
          <AddTemplateVersionForm />
        </FormProvider>
        <TemplatePicker
          file={file}
          setUploadedFile={setFile}
        />
      </Drawer>
      <DrawerButton
        onClick={toggleVisibility}
        type={ButtonType.PRIMARY}
      >
        <PlusIcon />
        {localize(Localization.ADD_NEW_TEMPLATE_VERSION)}
      </DrawerButton>
    </>
  )
}

export {
  AddTemplateVersionButton,
}
