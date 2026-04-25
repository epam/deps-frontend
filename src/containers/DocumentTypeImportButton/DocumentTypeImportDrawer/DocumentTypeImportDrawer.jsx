
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ButtonType, Button } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { Localization, localize } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { FORM_FIELD_CODES } from '../constants'
import { DocumentTypeImportForm } from '../DocumentTypeImportForm'
import {
  Drawer,
  DrawerFooterWrapper,
  Title,
} from './DocumentTypeImportDrawer.styles'

const DocumentTypeImportDrawer = ({
  closeDrawer,
  documentTypeName,
  fileName,
  loading,
  setData,
  upload,
  visible,
}) => {
  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
  })

  const {
    getValues,
    setValue,
    formState: { isValid },
    handleSubmit,
  } = methods

  useEffect(() => {
    setValue(FORM_FIELD_CODES.DOCUMENT_TYPE_NAME, documentTypeName)
    setValue(FORM_FIELD_CODES.FILE, fileName)
  }, [
    documentTypeName,
    fileName,
    setValue,
  ])

  const onSubmit = useCallback(() => {
    upload(getValues())
  }, [
    getValues,
    upload,
  ])

  const DrawerTitle = useMemo(() => (
    <Title>
      {localize(Localization.IMPORT_DOCUMENT_TYPE)}
    </Title>
  ), [])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <Button.Secondary
        disabled={loading}
        onClick={closeDrawer}
      >
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Button
        disabled={!isValid || loading}
        loading={loading}
        onClick={onSubmit}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.UPLOAD)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    closeDrawer,
    isValid,
    loading,
    onSubmit,
  ])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onClose={closeDrawer}
      open={visible}
      title={DrawerTitle}
      width={theme.size.drawerWidth}
    >
      <FormProvider {...methods}>
        <DocumentTypeImportForm
          disabled={loading}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          setData={setData}
        />
      </FormProvider>
    </Drawer>
  )
}

DocumentTypeImportDrawer.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  documentTypeName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export {
  DocumentTypeImportDrawer,
}
