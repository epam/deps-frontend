
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { refreshDocuments } from '@/actions/documentsListPage'
import { ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { ArrowRightOutlined } from '@/components/Icons/ArrowRightOutlined'
import { localize, Localization } from '@/localization/i18n'
import { ProgressModal } from '../ProgressModal'
import { DefaultFormValues, DRAWER_WIDTH_DEFAULT } from './constants'
import { DocumentSettingsForm } from './DocumentSettingsForm'
import { useUploadDocuments } from './hooks'
import {
  CancelButton,
  ContentWrapper,
  DrawerFooterWrapper,
  ResetButton,
  StyledDrawer,
  UploadButton,
} from './UploadDocumentsDrawer.style'
import { UploadFilesForm } from './UploadFilesForm'

export const UploadDocumentsDrawer = ({ isVisible, onClose }) => {
  const formApi = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: DefaultFormValues,
  })

  const {
    uploadDocuments,
    areDocumentsUploading,
    completedRequests,
  } = useUploadDocuments()

  const dispatch = useDispatch()

  const submitData = useCallback(async () => {
    const values = formApi.getValues()

    await uploadDocuments(values)

    dispatch(refreshDocuments())
  }, [
    formApi,
    uploadDocuments,
    dispatch,
  ])

  const formValues = formApi.watch()

  const isSaveDisabled = (
    !formValues.files?.length ||
    areDocumentsUploading ||
    (
      !formValues.documentType &&
      !formValues.group
    )
  )

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
          disabled={areDocumentsUploading}
          onClick={onReset}
        >
          {localize(Localization.RESET_SETTINGS)}
        </ResetButton>
      </DrawerFooterWrapper>
      <CancelButton
        disabled={areDocumentsUploading}
        onClick={onClose}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <UploadButton
        disabled={isSaveDisabled}
        loading={areDocumentsUploading}
        onClick={submitData}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.UPLOAD)}
        <ArrowRightOutlined />
      </UploadButton>
    </DrawerFooterWrapper>
  ), [
    areDocumentsUploading,
    onReset,
    onClose,
    isSaveDisabled,
    submitData,
  ])

  return (
    <FormProvider {...formApi}>
      <StyledDrawer
        destroyOnClose
        footer={DrawerFooter}
        getContainer={() => document.body}
        hasCloseIcon={false}
        onClose={onClose}
        open={isVisible}
        title={localize(Localization.DOCUMENTS_SETTINGS)}
        width={DRAWER_WIDTH_DEFAULT}
      >
        <ContentWrapper>
          <DocumentSettingsForm />
          <UploadFilesForm />
        </ContentWrapper>
      </StyledDrawer>
      {
        areDocumentsUploading && (
          <ProgressModal
            current={completedRequests}
            total={formValues.files.length}
          />
        )
      }
    </FormProvider>
  )
}

UploadDocumentsDrawer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
