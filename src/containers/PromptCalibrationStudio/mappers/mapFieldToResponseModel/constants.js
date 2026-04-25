
export const ModelTitle = {
  SINGLE_STRING: 'SingleStringResponse',
  MULTIPLE_STRINGS: 'MultipleStringsResponse',
  SINGLE_KEY_VALUE_PAIR: 'SingleKeyValuePairResponse',
  MULTIPLE_KEY_VALUE_PAIRS: 'MultipleKeyValuePairsResponse',
  SINGLE_BOOLEAN: 'SingleBooleanResponse',
  MULTIPLE_BOOLEANS: 'MultipleBooleansResponse',
}

export const STRING_TYPE = { type: 'string' }

export const BOOLEAN_TYPE = { type: 'boolean' }

export const KEY_VALUE_PAIR_TYPE = {
  type: 'object',
  properties: {
    key: STRING_TYPE,
    value: STRING_TYPE,
  },
  required: ['key', 'value'],
}
