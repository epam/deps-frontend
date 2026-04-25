
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import {
  useCreateOrUpdateSupplementsMutation,
  useLazyFetchSupplementsQuery,
} from '@/apiRTK/documentSupplementsApi'
import { Button, ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { StatusCode } from '@/enums/StatusCode'
import { Localization, localize } from '@/localization/i18n'
import { documentSupplementShape } from '@/models/DocumentSupplement'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { theme } from '@/theme/theme.default'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import {
  Drawer,
  CancelButton,
  DrawerFooterWrapper,
} from './AddDocumentSupplementDrawer.styles'
import { AddDocumentSupplementForm } from './AddDocumentSupplementForm'

const AddDocumentSupplementDrawer = ({
  documentId,
  documentTypeCode,
  isDrawerVisible,
  toggleDrawer,
  field,
  genAiPrompt,
}) => {
  const [
    createOrUpdateSupplements,
    { isLoading: areDocumentSupplementsUpdating },
  ] = useCreateOrUpdateSupplementsMutation()

  const [
    fetchSupplements,
    {
      isFetching: areDocumentSupplementsFetching,
    },
  ] = useLazyFetchSupplementsQuery()

  const isLoading = areDocumentSupplementsUpdating || areDocumentSupplementsFetching

  const methods = useForm({
    shouldUnregister: true,
    mode: FormValidationMode.ON_CHANGE,
  })

  const {
    getValues,
    setValue,
    trigger,
    formState: {
      isValid,
    },
  } = methods

  const onFieldChange = (fieldCode, value) => {
    setValue(fieldCode, value)
    trigger(fieldCode)
  }

  const getDocumentSupplements = useCallback(async () => {
    try {
      return await fetchSupplements(documentId).unwrap()
    } catch (e) {
      if (e.status === StatusCode.NOT_FOUND) {
        return []
      }

      throw e
    }
  }, [
    documentId,
    fetchSupplements,
  ])

  const createField = useCallback(async () => {
    try {
      const { name, value } = getValues()
      const documentTypeId = (
        documentTypeCode === UNKNOWN_DOCUMENT_TYPE.code
          ? null
          : documentTypeCode
      )

      const documentSupplements = await getDocumentSupplements()

      await createOrUpdateSupplements({
        documentId,
        documentTypeId,
        data: [
          ...documentSupplements,
          {
            name,
            value,
          },
        ],
      }).unwrap()

      notifySuccess(localize(Localization.FIELD_CREATION_SUCCESS_MESSAGE))
      toggleDrawer()
    } catch (e) {
      const errorCode = e?.response?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }, [
    documentId,
    documentTypeCode,
    getValues,
    toggleDrawer,
    createOrUpdateSupplements,
    getDocumentSupplements,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isLoading}
        onClick={toggleDrawer}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={!isValid || isLoading}
        loading={isLoading}
        onClick={createField}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SUBMIT)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    isLoading,
    createField,
    isValid,
    toggleDrawer,
  ])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onClose={toggleDrawer}
      open={isDrawerVisible}
      title={localize(Localization.ADD_EXTRA_FIELD_TO_DOCUMENT)}
      width={theme.size.drawerWidth}
    >
      <FormProvider {...methods}>
        <AddDocumentSupplementForm
          createField={createField}
          field={field}
          genAiPrompt={genAiPrompt}
          handleSubmit={methods.handleSubmit}
          onFieldChange={onFieldChange}
        />
      </FormProvider>
    </Drawer>
  )
}

AddDocumentSupplementDrawer.propTypes = {
  isDrawerVisible: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  field: documentSupplementShape.isRequired,
  genAiPrompt: PropTypes.string,
  documentId: PropTypes.string.isRequired,
  documentTypeCode: PropTypes.string.isRequired,
}

export {
  AddDocumentSupplementDrawer,
}
