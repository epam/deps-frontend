
import { mockEnv } from '@/mocks/mockEnv'
import { MULTIPLICITY } from '@/containers/PromptCalibrationStudio/viewModels/Field'
import { FieldType } from '@/enums/FieldType'
import { BOOLEAN_TYPE, STRING_TYPE } from './constants'
import {
  InsightsParseError,
  mapFieldToResponseModel,
  mapResponseValue,
} from './mapFieldToResponseModel'

jest.mock('@/utils/env', () => mockEnv)

test('returns single string response model for STRING type with SINGLE multiplicity', () => {
  const result = mapFieldToResponseModel(FieldType.STRING, MULTIPLICITY.SINGLE)

  expect(result).toEqual({
    title: 'SingleStringResponse',
    type: 'object',
    properties: {
      value: STRING_TYPE,
      reasoning: STRING_TYPE,
    },
    required: ['value', 'reasoning'],
  })
})

test('returns multiple strings response model for STRING type with MULTIPLE multiplicity', () => {
  const result = mapFieldToResponseModel(FieldType.STRING, MULTIPLICITY.MULTIPLE)

  expect(result).toEqual({
    title: 'MultipleStringsResponse',
    type: 'object',
    properties: {
      value: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            content: STRING_TYPE,
          },
          required: ['content'],
        },
      },
      reasoning: STRING_TYPE,
    },
    required: ['value', 'reasoning'],
  })
})

test('returns multiple strings response model with aliases for STRING type with MULTIPLE multiplicity', () => {
  const result = mapFieldToResponseModel(FieldType.STRING, MULTIPLICITY.MULTIPLE, { includeAliases: true })

  expect(result).toEqual({
    title: 'MultipleStringsResponse',
    type: 'object',
    properties: {
      value: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            content: STRING_TYPE,
            alias: STRING_TYPE,
          },
          required: ['content', 'alias'],
        },
      },
      reasoning: STRING_TYPE,
    },
    required: ['value', 'reasoning'],
  })
})

test('returns single key-value pair response model for DICTIONARY type with SINGLE multiplicity', () => {
  const result = mapFieldToResponseModel(FieldType.DICTIONARY, MULTIPLICITY.SINGLE)

  expect(result).toEqual({
    title: 'SingleKeyValuePairResponse',
    type: 'object',
    properties: {
      value: {
        type: 'object',
        properties: {
          key: STRING_TYPE,
          value: STRING_TYPE,
        },
        required: ['key', 'value'],
      },
      reasoning: STRING_TYPE,
    },
    required: ['value', 'reasoning'],
  })
})

test('returns multiple key-value pairs response model for DICTIONARY type with MULTIPLE multiplicity', () => {
  const result = mapFieldToResponseModel(FieldType.DICTIONARY, MULTIPLICITY.MULTIPLE)

  expect(result).toEqual({
    title: 'MultipleKeyValuePairsResponse',
    type: 'object',
    properties: {
      value: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                key: STRING_TYPE,
                value: STRING_TYPE,
              },
              required: ['key', 'value'],
            },
          },
          required: ['content'],
        },
      },
      reasoning: STRING_TYPE,
    },
    required: ['value', 'reasoning'],
  })
})

test('returns multiple key-value pairs response model with aliases for DICTIONARY type with MULTIPLE multiplicity', () => {
  const result = mapFieldToResponseModel(FieldType.DICTIONARY, MULTIPLICITY.MULTIPLE, { includeAliases: true })

  expect(result).toEqual({
    title: 'MultipleKeyValuePairsResponse',
    type: 'object',
    properties: {
      value: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                key: STRING_TYPE,
                value: STRING_TYPE,
              },
              required: ['key', 'value'],
            },
            alias: STRING_TYPE,
          },
          required: ['content', 'alias'],
        },
      },
      reasoning: STRING_TYPE,
    },
    required: ['value', 'reasoning'],
  })
})

test('returns single boolean response model for CHECKMARK type with SINGLE multiplicity', () => {
  const result = mapFieldToResponseModel(FieldType.CHECKMARK, MULTIPLICITY.SINGLE)

  expect(result).toEqual({
    title: 'SingleBooleanResponse',
    type: 'object',
    properties: {
      value: BOOLEAN_TYPE,
      reasoning: STRING_TYPE,
    },
    required: ['value', 'reasoning'],
  })
})

test('returns multiple booleans response model for CHECKMARK type with MULTIPLE multiplicity', () => {
  const result = mapFieldToResponseModel(FieldType.CHECKMARK, MULTIPLICITY.MULTIPLE)

  expect(result).toEqual({
    title: 'MultipleBooleansResponse',
    type: 'object',
    properties: {
      value: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            content: BOOLEAN_TYPE,
          },
          required: ['content'],
        },
      },
      reasoning: STRING_TYPE,
    },
    required: ['value', 'reasoning'],
  })
})

test('returns multiple booleans response model with aliases for CHECKMARK type with MULTIPLE multiplicity', () => {
  const result = mapFieldToResponseModel(FieldType.CHECKMARK, MULTIPLICITY.MULTIPLE, { includeAliases: true })

  expect(result).toEqual({
    title: 'MultipleBooleansResponse',
    type: 'object',
    properties: {
      value: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            content: BOOLEAN_TYPE,
            alias: STRING_TYPE,
          },
          required: ['content', 'alias'],
        },
      },
      reasoning: STRING_TYPE,
    },
    required: ['value', 'reasoning'],
  })
})

test('extracts result property from parsed object response', () => {
  const responseContent = { value: 'extracted value' }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual({ value: 'extracted value' })
})

test('extracts result property from JSON string response', () => {
  const responseContent = '{"value": "parsed value"}'
  const result = mapResponseValue(responseContent)

  expect(result).toEqual({ value: 'parsed value' })
})

test('extracts result array from parsed object response', () => {
  const responseContent = { value: ['value1', 'value2', 'value3'] }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual({ value: ['value1', 'value2', 'value3'] })
})

test('extracts result object from parsed response', () => {
  const responseContent = {
    value: {
      key: 'test',
      value: 'data',
    },
  }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual({
    value: {
      key: 'test',
      value: 'data',
    },
  })
})

test('extracts result array of objects from JSON string response', () => {
  const responseContent = '{"value": [{"key": "k1", "value": "v1"}, {"key": "k2", "value": "v2"}]}'
  const result = mapResponseValue(responseContent)

  expect(result).toEqual({
    value: [
      {
        key: 'k1',
        value: 'v1',
      },
      {
        key: 'k2',
        value: 'v2',
      },
    ],
  })
})

test('returns original value when responseContent is null', () => {
  const result = mapResponseValue(null)

  expect(result).toBe(null)
})

test('returns original value when responseContent is undefined', () => {
  const result = mapResponseValue(undefined)

  expect(result).toBe(undefined)
})

test('returns original value when responseContent is empty string', () => {
  const result = mapResponseValue('')

  expect(result).toBe(result)
})

test('throws InsightsParseError when JSON parsing fails', () => {
  const responseContent = 'not a valid json'

  expect(() => mapResponseValue(responseContent)).toThrow(InsightsParseError)
})

test('returns undefined when parsed content has no result property', () => {
  const responseContent = '{"data": "value"}'
  const result = mapResponseValue(responseContent)

  expect(result).toEqual({ data: 'value' })
})

test('extracts empty string result from response', () => {
  const responseContent = { value: '' }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual(responseContent)
})

test('extracts null result from response', () => {
  const responseContent = { value: null }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual(responseContent)
})

test('extracts zero result from response', () => {
  const responseContent = { value: 0 }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual(responseContent)
})

test('extracts false result from response', () => {
  const responseContent = { value: false }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual(responseContent)
})

test('extracts empty array result from response', () => {
  const responseContent = { value: [] }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual(responseContent)
})

test('extracts empty object result from response', () => {
  const responseContent = { value: {} }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual(responseContent)
})

test('extracts true boolean result from response', () => {
  const responseContent = { value: true }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual(responseContent)
})

test('extracts true boolean result from JSON string response', () => {
  const responseContent = '{"value": true}'
  const result = mapResponseValue(responseContent)

  expect(result).toEqual({ value: true })
})

test('extracts array of booleans from response', () => {
  const responseContent = { value: [true, false, true] }
  const result = mapResponseValue(responseContent)

  expect(result).toEqual(responseContent)
})
