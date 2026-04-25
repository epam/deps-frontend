
import PropTypes from 'prop-types'
import {
  useMemo,
  useState,
  createContext,
  useCallback,
} from 'react'
import { DEFAULT_EXTRACTOR } from '@/containers/PromptCalibrationStudio/constants'
import {
  fieldShape,
  extractorShape,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { childrenShape } from '@/utils/propTypes'

export const FieldCalibrationContext = createContext(null)

export const FieldCalibrationProvider = ({
  children,
  initialFields = [],
  initialExtractors,
  setCalibrationValues,
}) => {
  const [fields, setFields] = useState(initialFields)
  const [calibrationMode, setCalibrationMode] = useState(null)
  const [activeField, setActiveField] = useState(null)
  const [extractors, setExtractors] = useState(initialExtractors ?? [DEFAULT_EXTRACTOR])

  const closeCalibration = useCallback(() => {
    setCalibrationMode(null)
    setActiveField(null)
  }, [])

  const syncCalibrationValues = useCallback((fields, calibrationMode) => {
    setCalibrationValues({
      fields,
      extractors,
      initialFields,
      initialExtractors,
      calibrationMode,
    })
  }, [
    setCalibrationValues,
    extractors,
    initialFields,
    initialExtractors,
  ])

  const batchUpdateFieldsHandler = useCallback((fieldsToUpdateMap) => {
    const updatedFields = fields.map((f) => fieldsToUpdateMap[f.id] ?? f)

    setFields(updatedFields)
    syncCalibrationValues(updatedFields, calibrationMode)
  }, [
    fields,
    calibrationMode,
    syncCalibrationValues,
  ])

  const addFieldHandler = useCallback((field) => {
    const updatedFields = [...fields, field]

    setFields(updatedFields)
    syncCalibrationValues(updatedFields, calibrationMode)
  }, [
    fields,
    calibrationMode,
    syncCalibrationValues,
  ])

  const updateFieldsHandler = useCallback((updatedField, mode) => {
    const updatedFields = fields.map((f) => f.id === updatedField.id ? updatedField : f)
    const updatedMode = mode === undefined ? calibrationMode : mode

    setFields(updatedFields)
    syncCalibrationValues(updatedFields, updatedMode)
  }, [
    fields,
    calibrationMode,
    syncCalibrationValues,
  ])

  const changeCalibrationMode = useCallback((updatedMode) => {
    setCalibrationMode(updatedMode)
    syncCalibrationValues(fields, updatedMode)
  }, [fields, syncCalibrationValues])

  const closeCalibrationMode = useCallback(() => {
    closeCalibration()
    syncCalibrationValues(fields, null)
  }, [
    closeCalibration,
    fields,
    syncCalibrationValues,
  ])

  const updateFieldsAndClose = useCallback((updatedField, mode = null) => {
    updateFieldsHandler(updatedField, mode)
    closeCalibration()
  }, [updateFieldsHandler, closeCalibration])

  const deleteField = useCallback((fieldId) => {
    const updatedFields = fields.filter((field) => field.id !== fieldId)

    setFields(updatedFields)
    closeCalibration()
    syncCalibrationValues(updatedFields, null)
  }, [
    fields,
    syncCalibrationValues,
    closeCalibration,
  ])

  const reorderFields = useCallback((reorderedFields) => {
    setFields(reorderedFields)
    syncCalibrationValues(reorderedFields, calibrationMode)
  }, [
    calibrationMode,
    syncCalibrationValues,
  ])

  const value = useMemo(
    () => ({
      calibrationMode,
      setCalibrationMode: changeCalibrationMode,
      activeField,
      setActiveField,
      fields,
      setFields,
      deleteField,
      updateFields: updateFieldsHandler,
      batchUpdateFields: batchUpdateFieldsHandler,
      addField: addFieldHandler,
      extractors,
      setExtractors,
      defaultExtractor: extractors[0],
      closeCalibrationMode,
      updateFieldsAndClose,
      reorderFields,
    }),
    [
      calibrationMode,
      activeField,
      fields,
      deleteField,
      updateFieldsHandler,
      batchUpdateFieldsHandler,
      addFieldHandler,
      extractors,
      closeCalibrationMode,
      changeCalibrationMode,
      updateFieldsAndClose,
      reorderFields,
    ],
  )

  return (
    <FieldCalibrationContext.Provider value={value}>
      {children}
    </FieldCalibrationContext.Provider>
  )
}

FieldCalibrationProvider.propTypes = {
  children: childrenShape.isRequired,
  initialFields: PropTypes.arrayOf(fieldShape),
  initialExtractors: PropTypes.arrayOf(extractorShape),
  setCalibrationValues: PropTypes.func.isRequired,
}
