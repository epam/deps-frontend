
import isEqual from 'lodash/isEqual'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { clearKeyToAssign, setActiveTable } from '@/actions/prototypePage'
import {
  useCreateExtractionFieldMutation,
  useDeleteExtractionFieldMutation,
  useUpdateExtractionFieldMutation,
} from '@/apiRTK/extractionFieldsApi'
import {
  useCreatePrototypeFieldMappingMutation,
  useCreatePrototypeTabularMappingMutation,
  useUpdatePrototypeFieldMappingMutation,
  useUpdatePrototypeMutation,
  useUpdatePrototypeTabularMappingMutation,
} from '@/apiRTK/prototypesApi'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { TableFieldColumn, TableFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ENV } from '@/utils/env'
import { sendRequests } from '@/utils/sendRequests'

const mapPrototypeFieldToExtractionField = ({
  name,
  readOnly,
  confidential,
  fieldType,
  mapping,
  required,
}) => {
  const type = (
    mapping?.mappingType === MappingType.ONE_TO_MANY
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

const usePrototypeEditMode = (fetchedPrototype) => {
  const [isEditMode, setIsEditMode] = useState(true)
  const [editModePrototype, setEditModePrototype] = useState(fetchedPrototype)
  const [fieldsViewType, setFieldsViewType] = useState(PrototypeViewType.FIELDS)

  const dispatch = useDispatch()

  const isTableView = fieldsViewType === PrototypeViewType.TABLES

  const allEditModeFields = useMemo(() => ([
    ...(editModePrototype?.tableFields ?? []),
    ...(editModePrototype?.fields ?? []),
  ]), [
    editModePrototype?.fields,
    editModePrototype?.tableFields,
  ])

  const allSavedFields = useMemo(() => ([
    ...(fetchedPrototype?.tableFields ?? []),
    ...(fetchedPrototype?.fields ?? []),
  ]), [
    fetchedPrototype?.fields,
    fetchedPrototype?.tableFields,
  ])

  useEffect(() => {
    setEditModePrototype(fetchedPrototype)
  }, [
    fetchedPrototype,
  ])

  const [
    updatePrototype,
    { isLoading: isPrototypeDataUpdating },
  ] = useUpdatePrototypeMutation()

  const [
    updatePrototypeFieldMapping,
    { isLoading: isPrototypeFieldMappingUpdating },
  ] = useUpdatePrototypeFieldMappingMutation()

  const [
    createPrototypeFieldMapping,
    { isLoading: isPrototypeFieldMappingCreating },
  ] = useCreatePrototypeFieldMappingMutation()

  const [
    updatePrototypeField,
    { isLoading: isPrototypeFieldUpdating },
  ] = useUpdateExtractionFieldMutation()

  const [
    createPrototypeField,
    { isLoading: isPrototypeFieldCreating },
  ] = useCreateExtractionFieldMutation()

  const [
    deletePrototypeFields,
    { isLoading: isPrototypeFieldsDeleting },
  ] = useDeleteExtractionFieldMutation()

  const [
    updatePrototypeTabularMapping,
    { isLoading: isPrototypeTabularMappingUpdating },
  ] = useUpdatePrototypeTabularMappingMutation()

  const [
    createPrototypeTabularMapping,
    { isLoading: isPrototypeTabularMappingCreating },
  ] = useCreatePrototypeTabularMappingMutation()

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev)
  }

  const onCancel = () => {
    setEditModePrototype(fetchedPrototype)
    toggleEditMode()
    dispatch(setActiveTable(null))
    dispatch(clearKeyToAssign())
  }

  const onPrototypeInfoDataChange = (value) => {
    setEditModePrototype({
      ...editModePrototype,
      ...value,
    })
  }

  const onPrototypeFieldChange = (updatedField) => {
    setEditModePrototype((prevState) => {
      const { tableFields, fields } = prevState
      const targetFields = isTableView ? tableFields : fields

      const updatedFields = targetFields.map((field) =>
        field.id === updatedField.id
          ? {
            ...field,
            ...updatedField,
          }
          : field,
      )

      return {
        ...prevState,
        ...(isTableView
          ? { tableFields: updatedFields }
          : { fields: updatedFields }),
      }
    })
  }

  const addPrototypeField = (field) => {
    setEditModePrototype((prevState) => {
      const { tableFields, fields } = prevState
      const targetFields = isTableView ? tableFields : fields

      return {
        ...prevState,
        fields: isTableView ? fields : [...targetFields, field],
        tableFields: isTableView ? [...targetFields, field] : tableFields,
      }
    })
  }

  const removePrototypeField = (removedFieldId) => {
    setEditModePrototype((prev) => {
      const targetFields = isTableView ? prev.tableFields : prev.fields
      const updated = targetFields.filter((f) => f.id !== removedFieldId)

      return {
        ...prev,
        fields: isTableView ? prev.fields : updated,
        tableFields: isTableView ? updated : prev.tableFields,
      }
    })
  }

  const getModifiedFields = useCallback((draftFields, savedFields) => (
    draftFields.reduce((acc, currentField) => {
      const savedField = savedFields.find((f) => f.id === currentField.id)
      if (!savedField) return acc

      const hasChanged = (
        savedField.name !== currentField.name ||
        savedField.readOnly !== currentField.readOnly ||
        savedField.confidential !== currentField.confidential ||
        !isEqual(savedField.fieldType.description, currentField.fieldType.description)
      )

      if (hasChanged) {
        acc[currentField.id] = currentField
      }

      return acc
    }, {})
  ), [])

  const modifiedFieldsData = useMemo(() => (
    fetchedPrototype && editModePrototype
      ? getModifiedFields(editModePrototype.fields, fetchedPrototype.fields)
      : {}
  ), [
    getModifiedFields,
    editModePrototype,
    fetchedPrototype,
  ])

  const modifiedTableFieldsData = useMemo(() => (
    fetchedPrototype && editModePrototype
      ? getModifiedFields(editModePrototype.tableFields, fetchedPrototype.tableFields)
      : {}
  ), [
    getModifiedFields,
    editModePrototype,
    fetchedPrototype,
  ])

  const modifiedFieldsMapping = useMemo(() => {
    const modifiedFields = {}
    editModePrototype?.fields.forEach((editModeField) => {
      const savedField = fetchedPrototype.fields.find((field) => field.id === editModeField.id)

      if (!savedField) {
        return
      }

      const areMappingKeysChanged = !isEqual(
        [...editModeField.mapping.keys].sort(),
        [...savedField.mapping.keys].sort(),
      )

      if (areMappingKeysChanged) {
        modifiedFields[editModeField.id] = {
          ...editModeField.mapping,
          keys: editModeField.mapping.keys,
        }
      }
    })

    return modifiedFields
  }, [
    editModePrototype,
    fetchedPrototype,
  ])

  const modifiedTableFieldsMapping = useMemo(() => {
    if (!editModePrototype?.tableFields || !fetchedPrototype?.tableFields) return {}

    return editModePrototype.tableFields.reduce((acc, editField) => {
      const savedField = fetchedPrototype.tableFields.find((f) => f.id === editField.id)
      if (!savedField) return acc

      if (!isEqual(editField.tabularMapping, savedField.tabularMapping)) {
        acc[editField.id] = { ...editField.tabularMapping }
      }

      return acc
    }, {})
  }, [editModePrototype, fetchedPrototype])

  const modifiedPrototypeInfoData = useMemo(() => {
    if (!editModePrototype) {
      return {}
    }

    const {
      engine,
      language,
      description,
    } = editModePrototype

    return {
      ...(engine !== fetchedPrototype.engine && { engine }),
      ...(language !== fetchedPrototype.language && { language }),
      ...(description !== fetchedPrototype.description && { description }),
    }
  }, [
    editModePrototype,
    fetchedPrototype,
  ])

  const createdFields = useMemo(() => {
    const savedIds = fetchedPrototype?.fields.map((f) => f.id)
    return editModePrototype?.fields.filter((f) => !savedIds?.includes(f.id)) ?? []
  }, [
    editModePrototype?.fields,
    fetchedPrototype?.fields,
  ])

  const createdTableFields = useMemo(() => {
    const savedIds = fetchedPrototype?.tableFields.map((f) => f.id)
    return editModePrototype?.tableFields?.filter((f) => !savedIds.includes(f.id)) ?? []
  }, [
    editModePrototype?.tableFields,
    fetchedPrototype?.tableFields,
  ])

  const allRemovedFieldIds = useMemo(() => {
    const allEditModeFieldsIds = allEditModeFields.map((f) => f.id)
    const savedFieldsIds = allSavedFields.map((f) => f.id)
    return savedFieldsIds.filter((id) => !allEditModeFieldsIds?.includes(id))
  }, [
    allEditModeFields,
    allSavedFields,
  ])

  const onSave = async () => {
    const { id: prototypeId } = editModePrototype

    const updateFieldsRequests = Object.entries(modifiedFieldsData)
      .map(([fieldId, field]) =>
        () => updatePrototypeField({
          documentTypeCode: prototypeId,
          fieldCode: fieldId,
          data: mapPrototypeFieldToExtractionField(field),
        }).unwrap(),
      )

    const updateTableFieldsRequests = Object.entries(modifiedTableFieldsData)
      .map(([fieldId, field]) =>
        () => updatePrototypeField({
          documentTypeCode: prototypeId,
          fieldCode: fieldId,
          data: mapPrototypeTableFieldToExtractionField(field),
        }).unwrap(),
      )

    const updateFieldsMappingRequests = Object.entries(modifiedFieldsMapping)
      .map(([fieldCode, { keys }]) =>
        () => updatePrototypeFieldMapping({
          prototypeId,
          fieldCode,
          keys,
        }).unwrap(),
      )

    const updateTabularMappingRequests = Object.entries(modifiedTableFieldsMapping)
      .map(([fieldCode, tabularMapping]) =>
        () => updatePrototypeTabularMapping({
          prototypeId,
          fieldCode,
          tabularMapping,
        }).unwrap(),
      )

    const updatePrototypeInfoDataRequest = Object.keys(modifiedPrototypeInfoData).length ? [
      () => updatePrototype({
        prototypeId,
        engine: editModePrototype.engine,
        language: editModePrototype.language,
        ...modifiedPrototypeInfoData,
      }).unwrap(),
    ] : []

    const createPrototypeFieldsRequests = createdFields.map((field) =>
      async () => {
        const createdField = await createPrototypeField({
          documentTypeCode: prototypeId,
          field: mapPrototypeFieldToExtractionField(field),
        }).unwrap()

        await createPrototypeFieldMapping({
          prototypeId: editModePrototype.id,
          field: {
            ...createdField,
            mapping: field.mapping,
          },
        }).unwrap()
      },
    )

    const createPrototypeTableFieldsRequests = createdTableFields.map((field) =>
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

    const deletePrototypeFieldsRequest = !!allRemovedFieldIds.length && (
      () => deletePrototypeFields({
        documentTypeCode: prototypeId,
        fieldCodes: allRemovedFieldIds,
      }).unwrap()
    )

    const requests = [
      ...updatePrototypeInfoDataRequest,
      ...updateFieldsRequests,
      ...updateFieldsMappingRequests,
      ...updateTableFieldsRequests,
      ...updateTabularMappingRequests,
      ...createPrototypeFieldsRequests,
      ...createPrototypeTableFieldsRequests,
    ]

    deletePrototypeFieldsRequest && requests.push(deletePrototypeFieldsRequest)

    await sendRequests(
      requests,
      ENV.FEATURE_SEQUENTIAL_PROTOTYPE_REQUESTS,
    )
  }

  const isPrototypeTouched = (
    !!Object.keys(modifiedFieldsData).length ||
    !!Object.keys(modifiedTableFieldsData).length ||
    !!Object.keys(modifiedFieldsMapping).length ||
    !!Object.keys(modifiedTableFieldsMapping).length ||
    !!Object.keys(modifiedPrototypeInfoData).length ||
    !!createdFields.length ||
    !!createdTableFields.length ||
    !!allRemovedFieldIds.length
  )

  const isSaving = (
    isPrototypeDataUpdating ||
    isPrototypeFieldUpdating ||
    isPrototypeFieldMappingUpdating ||
    isPrototypeFieldMappingCreating ||
    isPrototypeFieldCreating ||
    isPrototypeFieldsDeleting ||
    isPrototypeTabularMappingUpdating ||
    isPrototypeTabularMappingCreating
  )

  const checkIfFieldIsSaved = (field) => (
    fetchedPrototype.fields.some((f) => f.id === field.id)
  )

  return {
    editModePrototype: editModePrototype || fetchedPrototype,
    isEditMode,
    isPrototypeTouched,
    isSaving,
    onCancel,
    onSave,
    toggleEditMode,
    onPrototypeFieldChange,
    onPrototypeInfoDataChange,
    addPrototypeField,
    removePrototypeField,
    checkIfFieldIsSaved,
    fieldsViewType,
    setFieldsViewType,
  }
}

export {
  usePrototypeEditMode,
}
