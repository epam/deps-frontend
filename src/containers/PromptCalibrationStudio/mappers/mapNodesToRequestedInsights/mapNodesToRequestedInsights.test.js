
import { mockEnv } from '@/mocks/mockEnv'
import { MULTIPLICITY } from '@/containers/PromptCalibrationStudio/viewModels/Field'
import { FieldType } from '@/enums/FieldType'
import { mapNodesToRequestedInsights } from './mapNodesToRequestedInsights'

jest.mock('@/utils/env', () => mockEnv)

test('returns requested insights structure with multiple prompts for STRING type with SINGLE multiplicity', () => {
  const field = {
    id: 'field-1',
    fieldType: FieldType.STRING,
    multiplicity: MULTIPLICITY.SINGLE,
    aliases: false,
  }
  const nodes = [
    { prompt: 'First prompt' },
    { prompt: 'Second prompt' },
    { prompt: 'Third prompt' },
  ]

  const result = mapNodesToRequestedInsights(field, nodes)

  expect(result).toEqual({
    'field-1': {
      workflow: {
        prompts: [
          { content: 'First prompt' },
          { content: 'Second prompt' },
          { content: 'Third prompt' },
        ],
        responseModel: {
          title: 'SingleStringResponse',
          type: 'object',
          properties: {
            value: { type: 'string' },
            reasoning: { type: 'string' },
          },
          required: ['value', 'reasoning'],
        },
      },
    },
  })
})

test('returns requested insights structure with aliases for STRING type with MULTIPLE multiplicity', () => {
  const field = {
    id: 'field-2',
    fieldType: FieldType.STRING,
    multiplicity: MULTIPLICITY.MULTIPLE,
    aliases: true,
  }
  const nodes = [
    { prompt: 'Extract multiple strings' },
  ]

  const result = mapNodesToRequestedInsights(field, nodes)

  expect(result).toEqual({
    'field-2': {
      workflow: {
        prompts: [
          { content: 'Extract multiple strings' },
        ],
        responseModel: {
          title: 'MultipleStringsResponse',
          type: 'object',
          properties: {
            value: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  content: { type: 'string' },
                  alias: { type: 'string' },
                },
                required: ['content', 'alias'],
              },
            },
            reasoning: { type: 'string' },
          },
          required: ['value', 'reasoning'],
        },
      },
    },
  })
})

test('returns requested insights structure without aliases for DICTIONARY type with MULTIPLE multiplicity', () => {
  const field = {
    id: 'field-3',
    fieldType: FieldType.DICTIONARY,
    multiplicity: MULTIPLICITY.MULTIPLE,
    aliases: false,
  }
  const nodes = [
    { prompt: 'Extract key-value pairs' },
  ]

  const result = mapNodesToRequestedInsights(field, nodes)

  expect(result).toEqual({
    'field-3': {
      workflow: {
        prompts: [
          { content: 'Extract key-value pairs' },
        ],
        responseModel: {
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
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    required: ['key', 'value'],
                  },
                },
                required: ['content'],
              },
            },
            reasoning: { type: 'string' },
          },
          required: ['value', 'reasoning'],
        },
      },
    },
  })
})

test('returns requested insights structure for CHECKMARK type with SINGLE multiplicity', () => {
  const field = {
    id: 'field-4',
    fieldType: FieldType.CHECKMARK,
    multiplicity: MULTIPLICITY.SINGLE,
    aliases: false,
  }
  const nodes = [
    { prompt: 'Is this true or false?' },
  ]

  const result = mapNodesToRequestedInsights(field, nodes)

  expect(result).toEqual({
    'field-4': {
      workflow: {
        prompts: [
          { content: 'Is this true or false?' },
        ],
        responseModel: {
          title: 'SingleBooleanResponse',
          type: 'object',
          properties: {
            value: { type: 'boolean' },
            reasoning: { type: 'string' },
          },
          required: ['value', 'reasoning'],
        },
      },
    },
  })
})
