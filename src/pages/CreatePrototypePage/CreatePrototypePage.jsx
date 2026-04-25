
import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useCreateExtractionFieldMutation } from '@/apiRTK/extractionFieldsApi'
import {
  useCreatePrototypeFieldMappingMutation,
  useCreatePrototypeMutation,
  useCreatePrototypeTabularMappingMutation,
} from '@/apiRTK/prototypesApi'
import { ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form/ReactHookForm'
import { Content } from '@/components/Layout'
import { Spin } from '@/components/Spin'
import { PageNavigationHeader } from '@/containers/PageNavigationHeader'
import { PrototypeData } from '@/containers/PrototypeData'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { Localization, localize } from '@/localization/i18n'
import { TableFieldColumn, TableFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { notifyError, notifyWarning } from '@/utils/notification'
import { goTo } from '@/utils/routerActions'
import { sendRequests } from '@/utils/sendRequests'
import { SaveButton } from './CreatePrototypePage.styles'
import { PrototypeInfo } from './PrototypeInfo'

const mapPrototypeFieldToExtractionField = ({
  name,
  readOnly,
  confidential,
  fieldType,
  mapping,
  required,
}) => {
  const type = (
    mapping.mappingType === MappingType.ONE_TO_MANY
      ? FieldType.LIST
      : fieldType.typeCode
  )

  return ({
    name,
    readOnly,
    confidential,
    fieldMeta: fieldType.description,
    required,
    fieldType: type,
  })
}

const mapPrototypeTableFieldToExtractionField = ({ name, tabularMapping }) => ({
  name: name,
  fieldType: FieldType.TABLE,
  required: false,
  fieldMeta: new TableFieldMeta(
    tabularMapping.headers.map((h) => (
      new TableFieldColumn(h.name)
    )),
  ),
})

const CreatePrototypePage = () => {
  const [fields, setFields] = useState([])
  const [tableFields, setTableFields] = useState([])
  const [fieldsViewType, setFieldsViewType] = useState(PrototypeViewType.FIELDS)

  const isFieldsView = fieldsViewType === PrototypeViewType.FIELDS

  const [
    createPrototype,
    { isLoading: isPrototypeCreating },
  ] = useCreatePrototypeMutation()

  const [
    createPrototypeField,
    { isLoading: isPrototypeFieldCreating },
  ] = useCreateExtractionFieldMutation()

  const [
    createPrototypeFieldMapping,
    { isLoading: isPrototypeFieldMappingCreating },
  ] = useCreatePrototypeFieldMappingMutation()

  const [
    createPrototypeTabularMapping,
    { isLoading: isPrototypeTabularMappingCreating },
  ] = useCreatePrototypeTabularMappingMutation()

  const methods = useForm({
    mode: FormValidationMode.ALL,
  })

  const {
    formState: { isValid },
    getValues: getPrototypeInfoData,
  } = methods

  const createPrototypeFields = async (prototypeId) => {
    try {
      const createPrototypeFieldsRequests = fields.map((field) =>
        async () => {
          const createdField = await createPrototypeField({
            documentTypeCode: prototypeId,
            field: mapPrototypeFieldToExtractionField(field),
          }).unwrap()

          await createPrototypeFieldMapping({
            prototypeId,
            field: {
              ...createdField,
              mapping: field.mapping,
            },
          }).unwrap()
        },
      )

      const createPrototypeTableFieldsRequests = tableFields.map((field) =>
        async () => {
          const createdField = await createPrototypeField({
            documentTypeCode: prototypeId,
            field: mapPrototypeTableFieldToExtractionField(field),
          }).unwrap()

          await createPrototypeTabularMapping({
            prototypeId,
            data: {
              code: createdField.code,
              ...field.tabularMapping,
            },
          }).unwrap()
        },
      )

      await sendRequests(
        [
          ...createPrototypeFieldsRequests,
          ...createPrototypeTableFieldsRequests,
        ],
        ENV.FEATURE_SEQUENTIAL_PROTOTYPE_REQUESTS,
      )
    } catch {
      notifyWarning(localize(Localization.PROTOTYPE_SAVING_ERROR))
    }
  }

  const onSave = async () => {
    try {
      const prototypeInfoData = getPrototypeInfoData()
      const { id } = await createPrototype(prototypeInfoData).unwrap()
      await createPrototypeFields(id)
      goTo(navigationMap.documentTypes.documentType(id))
    } catch (error) {
      const message = RESOURCE_ERROR_TO_DISPLAY[error.data?.code] || localize(Localization.PROTOTYPE_SAVING_ERROR)
      notifyError(message)
    }
  }

  const addPrototypeField = (newField) => (
    isFieldsView
      ? setFields([...fields, newField])
      : setTableFields([...tableFields, newField])
  )

  const removePrototypeField = (removedFieldId) => {
    const targetFields = isFieldsView ? fields : tableFields
    const updatedItems = targetFields.filter((field) => field.id !== removedFieldId)
    return isFieldsView ? setFields(updatedItems) : setTableFields(updatedItems)
  }

  const onPrototypeFieldChange = (field) => {
    const targetFields = isFieldsView ? fields : tableFields
    const updatedItems = targetFields.map((f) => (f.id === field.id ? field : f))
    return isFieldsView ? setFields(updatedItems) : setTableFields(updatedItems)
  }

  const renderExtra = () => (
    <SaveButton
      disabled={!isValid}
      onClick={onSave}
      type={ButtonType.PRIMARY}
    >
      {localize(Localization.SUBMIT)}
    </SaveButton>
  )

  if (
    isPrototypeCreating ||
    isPrototypeFieldCreating ||
    isPrototypeFieldMappingCreating ||
    isPrototypeTabularMappingCreating
  ) {
    return <Spin.Centered spinning />
  }

  return (
    <Content>
      <PageNavigationHeader
        parentPath={navigationMap.documentTypes()}
        renderExtra={renderExtra}
        title={localize(Localization.NEW_PROTOTYPE)}
      />
      <FormProvider {...methods}>
        <PrototypeInfo
          fieldsViewType={fieldsViewType}
          setFieldsViewType={setFieldsViewType}
        />
      </FormProvider>
      <PrototypeData
        addField={addPrototypeField}
        fieldsViewType={fieldsViewType}
        isEditMode={true}
        regularFields={fields}
        removeField={removePrototypeField}
        tableFields={tableFields}
        updateField={onPrototypeFieldChange}
      />
    </Content>
  )
}

export {
  CreatePrototypePage,
}
