
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { ArrowRightOutlined } from '@/components/Icons/ArrowRightOutlined'
import { ProgressModal } from '@/containers/ProgressModal'
import { localize, Localization } from '@/localization/i18n'
import { DefaultFormValues, DRAWER_WIDTH_DEFAULT } from './constants'
import { FileSettingsForm } from './FileSettingsForm'
import { useUploadFiles } from './hooks'
import {
  CancelButton,
  ContentWrapper,
  DrawerFooterWrapper,
  ResetButton,
  StyledDrawer,
  UploadButton,
} from './UploadFilesDrawer.style'
import { UploadFilesForm } from './UploadFilesForm'

export const UploadFilesDrawer = ({ isVisible, onClose }) => {
  const formApi = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: DefaultFormValues,
  })

  const {
    uploadFiles,
    areFilesUploading,
    completedRequests,
  } = useUploadFiles()

  const closeDrawer = useCallback(() => {
    onClose()
  }, [onClose])

  const submitData = useCallback(async () => {
    const values = formApi.getValues()

    await uploadFiles(values)
  }, [
    formApi,
    uploadFiles,
  ])

  const formValues = formApi.watch()

  const isSaveDisabled = !formValues.files?.length || areFilesUploading

  const onReset = useCallback(() => {
    formApi.reset({
      ...DefaultFormValues,
      files: formValues.files,
    })
  }, [formApi, formValues.files])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <DrawerFooterWrapper>
        <ResetButton
          disabled={areFilesUploading}
          onClick={onReset}
        >
          {localize(Localization.RESET_SETTINGS)}
        </ResetButton>
      </DrawerFooterWrapper>
      <CancelButton
        disabled={areFilesUploading}
        onClick={closeDrawer}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <UploadButton
        disabled={isSaveDisabled}
        loading={areFilesUploading}
        onClick={submitData}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.UPLOAD)}
        <ArrowRightOutlined />
      </UploadButton>
    </DrawerFooterWrapper>
  ), [
    areFilesUploading,
    onReset,
    closeDrawer,
    isSaveDisabled,
    submitData,
  ])

  return (
    <>
      <FormProvider {...formApi}>
        <StyledDrawer
          destroyOnClose
          footer={DrawerFooter}
          getContainer={() => document.body}
          hasCloseIcon={false}
          onClose={closeDrawer}
          open={isVisible}
          title={localize(Localization.FILES_SETTINGS)}
          width={DRAWER_WIDTH_DEFAULT}
        >
          <ContentWrapper>
            <FileSettingsForm />
            <UploadFilesForm />
          </ContentWrapper>
        </StyledDrawer>
      </FormProvider>
      {
        areFilesUploading && (
          <ProgressModal
            current={completedRequests}
            total={formValues.files.length}
          />
        )
      }
    </>
  )
}

UploadFilesDrawer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
