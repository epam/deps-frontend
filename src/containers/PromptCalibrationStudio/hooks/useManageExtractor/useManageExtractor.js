
import { useCallback } from 'react'
import {
  Extractor,
  Field,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import { useExtractFieldsValues } from '../useExtractFieldsValues'
import { useFieldCalibration } from '../useFieldCalibration'

export const useManageExtractor = () => {
  const {
    extractors,
    setExtractors,
    activeField,
    setActiveField,
    updateFields,
  } = useFieldCalibration()

  const { extractFieldsValues, isRetrievingInsights } = useExtractFieldsValues()

  const updateExtractorForAllFields = useCallback(async (formValues, extractorId) => {
    const newExtractor = new Extractor({
      id: extractorId,
      ...formValues,
    })

    const updatedExtractors = extractors.map((e) =>
      e.id === newExtractor.id ? newExtractor : e,
    )

    setExtractors(updatedExtractors)

    await extractFieldsValues(newExtractor)

    return newExtractor
  }, [
    extractors,
    setExtractors,
    extractFieldsValues,
  ])

  const updateExtractorForActiveField = useCallback((formValues) => {
    const newExtractor = new Extractor({
      ...formValues,
      name: localize(Localization.NAME_FOR_EXTRACTOR, { fieldName: activeField.name }),
    })

    setExtractors((prevExtractors) => [...prevExtractors, newExtractor])

    const updatedField = Field.updateExtractor(activeField, newExtractor.id)
    setActiveField(updatedField)
    updateFields(updatedField)

    return newExtractor
  }, [
    activeField,
    setExtractors,
    setActiveField,
    updateFields,
  ])

  const createNewExtractor = useCallback((formValues) => {
    const extractor = new Extractor({ ...formValues })
    setExtractors((prevExtractors) => [...prevExtractors, extractor])

    return extractor
  }, [setExtractors])

  return {
    isRetrievingInsights,
    updateExtractorForAllFields,
    updateExtractorForActiveField,
    createNewExtractor,
  }
}
