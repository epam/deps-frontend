
import { CHAR_TYPE } from '@/containers/FieldBusinessRuleModal/constants'
import { MULTIPLICITY } from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'

const getDictionaryMeta = () => ({
  keyType: FieldType.STRING,
  valueType: FieldType.STRING,
})

const mapBaseTypeToCharType = {
  [FieldType.STRING]: { charType: CHAR_TYPE.ALPHANUMERIC },
  [FieldType.CHECKMARK]: { charType: CHAR_TYPE.BOOLEAN },
  [FieldType.DICTIONARY]: getDictionaryMeta(),
}

export const mapFieldToExtractionField = (field) => {
  const {
    multiplicity,
    fieldType: baseType,
    confidential,
    name,
    readOnly,
    required,
    extractorId,
    order,
  } = field

  const isMultiple = multiplicity === MULTIPLICITY.MULTIPLE
  const fieldType = isMultiple ? FieldType.LIST : baseType

  const baseTypeMeta = mapBaseTypeToCharType[baseType]

  const getFieldMeta = () => {
    if (isMultiple) {
      return {
        baseType,
        baseTypeMeta,
      }
    }

    if (baseType === FieldType.DICTIONARY) {
      return getDictionaryMeta()
    }

    return {}
  }

  const fieldMeta = getFieldMeta()

  return {
    name,
    required,
    readOnly,
    confidential,
    fieldType,
    extractorId,
    fieldMeta,
    order,
  }
}
