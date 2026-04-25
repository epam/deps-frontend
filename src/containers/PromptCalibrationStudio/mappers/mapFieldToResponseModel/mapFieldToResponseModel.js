
import { MULTIPLICITY } from '@/containers/PromptCalibrationStudio/viewModels/Field'
import { FieldType } from '@/enums/FieldType'
import {
  BOOLEAN_TYPE,
  KEY_VALUE_PAIR_TYPE,
  ModelTitle,
  STRING_TYPE,
} from './constants'

export class InsightsParseError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InsightsParseError'
  }

  static isInsightsParseError = (error) => {
    return error instanceof InsightsParseError
  }

  static create = (error) => {
    return new InsightsParseError(error.message)
  }
}

const createArrayItemModel = (contentType, { includeAliases = false }) => ({
  type: 'object',
  properties: {
    content: contentType,
    ...(includeAliases && { alias: STRING_TYPE }),
  },
  required: includeAliases ? ['content', 'alias'] : ['content'],
})

const createSingleResponse = (title, valueType) => ({
  title,
  type: 'object',
  properties: {
    value: valueType,
    reasoning: STRING_TYPE,
  },
  required: ['value', 'reasoning'],
})

const createListResponse = (title, contentType, options = {}) => ({
  title,
  type: 'object',
  properties: {
    value: {
      type: 'array',
      items: createArrayItemModel(contentType, options),
    },
    reasoning: STRING_TYPE,
  },
  required: ['value', 'reasoning'],
})

const RESPONSE_MODEL_BUILDERS = {
  [FieldType.STRING]: {
    [MULTIPLICITY.SINGLE]: () => createSingleResponse(ModelTitle.SINGLE_STRING, STRING_TYPE),
    [MULTIPLICITY.MULTIPLE]: (options) => createListResponse(ModelTitle.MULTIPLE_STRINGS, STRING_TYPE, options),
  },
  [FieldType.DICTIONARY]: {
    [MULTIPLICITY.SINGLE]: () => createSingleResponse(ModelTitle.SINGLE_KEY_VALUE_PAIR, KEY_VALUE_PAIR_TYPE),
    [MULTIPLICITY.MULTIPLE]: (options) => createListResponse(ModelTitle.MULTIPLE_KEY_VALUE_PAIRS, KEY_VALUE_PAIR_TYPE, options),
  },
  [FieldType.CHECKMARK]: {
    [MULTIPLICITY.SINGLE]: () => createSingleResponse(ModelTitle.SINGLE_BOOLEAN, BOOLEAN_TYPE),
    [MULTIPLICITY.MULTIPLE]: (options) => createListResponse(ModelTitle.MULTIPLE_BOOLEANS, BOOLEAN_TYPE, options),
  },
}

export const mapFieldToResponseModel = (fieldType, multiplicity, options = {}) => {
  const builder = RESPONSE_MODEL_BUILDERS[fieldType][multiplicity]

  return builder(options)
}

export const mapResponseValue = (responseContent) => {
  if (!responseContent) {
    return responseContent
  }

  if (typeof responseContent !== 'string') {
    return responseContent
  }

  try {
    const parsed = JSON.parse(responseContent)
    return parsed
  } catch (error) {
    throw InsightsParseError.create(error)
  }
}
