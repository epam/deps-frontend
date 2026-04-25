
import { mockEnv } from '@/mocks/mockEnv'
import {
  QueryNode,
  Field,
  ListItemValue,
  KeyValuePairValue,
  MULTIPLICITY,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeV2 } from '@/models/DocumentTypeV2'
import { FieldData, DictFieldData } from '@/models/ExtractedData'
import { ExtractedDataFieldV2 } from '@/models/ExtractedData/ExtractedDataFieldV2'
import { LLMExtractionQuery, LLMExtractor } from '@/models/LLMExtractor'
import { mapGenAiFieldsToStudioFields } from './mapGenAiFieldsToStudioFields'

jest.mock('@/utils/env', () => mockEnv)

const mockQueryNodes = [
  new QueryNode({
    id: 'node-1',
    name: 'Node 1',
    prompt: 'Extract field data',
  }),
]

const mockExtractor = new LLMExtractor({
  extractorId: 'extractor-1',
  name: 'Test Extractor',
  queries: [
    new LLMExtractionQuery({
      code: 'field-1',
      workflow: {
        nodes: mockQueryNodes,
      },
    }),
  ],
})

const mockDocumentType = new DocumentTypeV2({
  extractionFields: [
    new DocumentTypeField(
      'field-1',
      'Field 1',
      {},
      FieldType.STRING,
      false,
      0,
      'document-type-1',
      1,
    ),
  ],
  llmExtractors: [mockExtractor],
})

const mockExtractedData = [
  new ExtractedDataFieldV2(
    mockDocumentType.extractionFields[0].code,
    new FieldData('Extracted value'),
    null,
    true,
  ),
]

beforeEach(() => {
  jest.clearAllMocks()
})

test('transforms GenAI fields to studio fields correctly', () => {
  const result = mapGenAiFieldsToStudioFields(mockExtractedData, mockDocumentType)
  const multiplicity = Field.getFieldMultiplicity(mockDocumentType.extractionFields[0].fieldType)

  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    id: mockDocumentType.extractionFields[0].code,
    aliases: !mockExtractedData[0].aliases,
    confidential: mockDocumentType.extractionFields[0].confidential,
    extractorId: mockExtractor.extractorId,
    fieldType: mockDocumentType.extractionFields[0].fieldType,
    multiplicity,
    name: mockDocumentType.extractionFields[0].name,
    readOnly: mockDocumentType.extractionFields[0].readOnly,
    value: mockExtractedData[0].data?.value,
    query: {
      id: mockDocumentType.extractionFields[0].code,
      nodes: mockExtractor.queries[0].workflow.nodes,
    },
  })
})

test('sets multiplicity to MULTIPLE for LIST field type', () => {
  const listExtractor = new LLMExtractor({
    extractorId: 'extractor-2',
    name: 'List Extractor',
    queries: [
      new LLMExtractionQuery({
        code: 'field-2',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      new DocumentTypeField(
        'field-2',
        'List Field',
        { baseType: FieldType.STRING },
        FieldType.LIST,
        false,
        0,
        'document-type-1',
        2,
      ),
    ],
    llmExtractors: [listExtractor],
  }

  const extractedData = [
    new ExtractedDataFieldV2(
      'field-2',
      [
        new FieldData('value1'),
        new FieldData('value2'),
      ],
      null,
      {},
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].multiplicity).toBe(MULTIPLICITY.MULTIPLE)
  expect(result[0].value).toHaveLength(2)
  expect(result[0].value[0]).toBeInstanceOf(ListItemValue)
  expect(result[0].value[0].content).toBe('value1')
  expect(result[0].value[1].content).toBe('value2')
})

test('filters out non genAI fields ', () => {
  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      ...mockDocumentType.extractionFields,
      new DocumentTypeField(
        'field-2',
        'Field 2',
        {},
        FieldType.STRING,
        false,
        0,
        'document-type-1',
        2,
      ),
    ],
  }

  const result = mapGenAiFieldsToStudioFields(mockExtractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].id).toBe(mockDocumentType.extractionFields[0].code)
})

test('handles undefined extractionFields', () => {
  const documentType = {
    llmExtractors: [mockExtractor],
  }

  const result = mapGenAiFieldsToStudioFields(mockExtractedData, documentType)

  expect(result).toEqual([])
})

test('returns ListItemValue with KeyValuePairValue for DICTIONARY LIST field type', () => {
  const dictListExtractor = new LLMExtractor({
    extractorId: 'extractor-3',
    name: 'Dict List Extractor',
    queries: [
      new LLMExtractionQuery({
        code: 'field-3',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      new DocumentTypeField(
        'field-3',
        'Dict List Field',
        { baseType: FieldType.DICTIONARY },
        FieldType.LIST,
        false,
        0,
        'document-type-1',
        3,
      ),
    ],
    llmExtractors: [dictListExtractor],
  }

  const extractedData = [
    new ExtractedDataFieldV2(
      'field-3',
      [
        new DictFieldData(new FieldData('key1'), new FieldData('value1')),
        new DictFieldData(new FieldData('key2'), new FieldData('value2')),
      ],
      null,
      {},
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].value).toHaveLength(2)
  expect(result[0].value[0]).toBeInstanceOf(ListItemValue)
  expect(result[0].value[0].content).toBeInstanceOf(KeyValuePairValue)
  expect(result[0].value[0].content.key).toBe('key1')
  expect(result[0].value[0].content.value).toBe('value1')
  expect(result[0].value[1].content.key).toBe('key2')
  expect(result[0].value[1].content.value).toBe('value2')
})

test('returns KeyValuePairValue for single DICTIONARY field type', () => {
  const dictExtractor = new LLMExtractor({
    extractorId: 'extractor-4',
    name: 'Dict Extractor',
    queries: [
      new LLMExtractionQuery({
        code: 'field-4',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      new DocumentTypeField(
        'field-4',
        'Dict Field',
        {},
        FieldType.DICTIONARY,
        false,
        0,
        'document-type-1',
        4,
      ),
    ],
    llmExtractors: [dictExtractor],
  }

  const extractedData = [
    new ExtractedDataFieldV2(
      'field-4',
      new DictFieldData(new FieldData('testKey'), new FieldData('testValue')),
      null,
      false,
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].value).toBeInstanceOf(KeyValuePairValue)
  expect(result[0].value.key).toBe('testKey')
  expect(result[0].value.value).toBe('testValue')
})

test('returns default ListItemValue when data is null for LIST field', () => {
  const listExtractor = new LLMExtractor({
    extractorId: 'extractor-5',
    name: 'List Extractor',
    queries: [
      new LLMExtractionQuery({
        code: 'field-5',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      new DocumentTypeField(
        'field-5',
        'List Field',
        { baseType: FieldType.STRING },
        FieldType.LIST,
        false,
        0,
        'document-type-1',
        5,
      ),
    ],
    llmExtractors: [listExtractor],
  }

  const extractedData = [
    new ExtractedDataFieldV2(
      'field-5',
      null,
      null,
      false,
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].value).toHaveLength(1)
  expect(result[0].value[0]).toBeInstanceOf(ListItemValue)
  expect(result[0].value[0].content).toBe('')
})

test('returns default ListItemValue with KeyValuePairValue when data is null for DICTIONARY LIST field', () => {
  const dictListExtractor = new LLMExtractor({
    extractorId: 'extractor-6',
    name: 'Dict List Extractor',
    queries: [
      new LLMExtractionQuery({
        code: 'field-6',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      new DocumentTypeField(
        'field-6',
        'Dict List Field',
        { baseType: FieldType.DICTIONARY },
        FieldType.LIST,
        false,
        0,
        'document-type-1',
        6,
      ),
    ],
    llmExtractors: [dictListExtractor],
  }

  const extractedData = [
    new ExtractedDataFieldV2(
      'field-6',
      null,
      null,
      false,
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].value).toHaveLength(1)
  expect(result[0].value[0]).toBeInstanceOf(ListItemValue)
  expect(result[0].value[0].content).toBeInstanceOf(KeyValuePairValue)
  expect(result[0].value[0].content.key).toBe('')
  expect(result[0].value[0].content.value).toBe('')
})

test('sets aliases to true when aliases object is present in extracted data', () => {
  const mockAliases = {
    'id-1': 'alias-1',
    'id-2': 'alias-2',
  }

  const extractedData = [
    new ExtractedDataFieldV2(
      mockDocumentType.extractionFields[0].code,
      new FieldData('Extracted value'),
      null,
      mockAliases,
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, mockDocumentType)

  expect(result).toHaveLength(1)
  expect(result[0].aliases).toBe(true)
})

test('filters out fields with unsupported base types', () => {
  const unsupportedExtractor = new LLMExtractor({
    extractorId: 'extractor-7',
    name: 'Unsupported Extractor',
    queries: [
      new LLMExtractionQuery({
        code: 'field-7',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      ...mockDocumentType.extractionFields,
      new DocumentTypeField(
        'field-7',
        'Unsupported Field',
        { baseType: FieldType.TABLE },
        FieldType.LIST,
        false,
        0,
        'document-type-1',
        7,
      ),
    ],
    llmExtractors: [mockExtractor, unsupportedExtractor],
  }

  const result = mapGenAiFieldsToStudioFields(mockExtractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].id).toBe(mockDocumentType.extractionFields[0].code)
})

test('handles CHECKMARK field type correctly', () => {
  const checkmarkExtractor = new LLMExtractor({
    extractorId: 'extractor-8',
    name: 'Checkmark Extractor',
    queries: [
      new LLMExtractionQuery({
        code: 'field-8',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      new DocumentTypeField(
        'field-8',
        'Checkmark Field',
        {},
        FieldType.CHECKMARK,
        false,
        0,
        'document-type-1',
        8,
      ),
    ],
    llmExtractors: [checkmarkExtractor],
  }

  const extractedData = [
    new ExtractedDataFieldV2(
      'field-8',
      new FieldData(true),
      null,
      null,
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].fieldType).toBe(FieldType.CHECKMARK)
  expect(result[0].value).toBe(true)
  expect(result[0].multiplicity).toBe(MULTIPLICITY.SINGLE)
})

test('handles LIST field with aliases correctly', () => {
  const listExtractor = new LLMExtractor({
    extractorId: 'extractor-9',
    name: 'List Extractor',
    queries: [
      new LLMExtractionQuery({
        code: 'field-9',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      new DocumentTypeField(
        'field-9',
        'List Field with Aliases',
        { baseType: FieldType.STRING },
        FieldType.LIST,
        false,
        0,
        'document-type-1',
        9,
      ),
    ],
    llmExtractors: [listExtractor],
  }

  const mockItemId = 'item-1'

  const mockAliases = {
    [mockItemId]: 'alias-1',
  }

  const item1 = new FieldData('value1')
  item1.id = mockItemId

  const mockListData = [item1]

  const extractedData = [
    new ExtractedDataFieldV2(
      'field-9',
      mockListData,
      null,
      mockAliases,
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].value[0].alias).toBe(mockAliases[mockItemId])
})

test('handles DICTIONARY LIST field with aliases correctly', () => {
  const dictListExtractor = new LLMExtractor({
    extractorId: 'extractor-10',
    name: 'Dict List Extractor',
    queries: [
      new LLMExtractionQuery({
        code: 'field-10',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      new DocumentTypeField(
        'field-10',
        'Dict List Field with Aliases',
        { baseType: FieldType.DICTIONARY },
        FieldType.LIST,
        false,
        0,
        'document-type-1',
        10,
      ),
    ],
    llmExtractors: [dictListExtractor],
  }

  const mockDictId = 'dict-1'

  const mockAliases = {
    [mockDictId]: 'alias-1',
  }

  const dict1 = new DictFieldData(new FieldData('key1'), new FieldData('value1'))
  dict1.id = mockDictId

  const mockDictListData = [dict1]

  const extractedData = [
    new ExtractedDataFieldV2(
      'field-10',
      mockDictListData,
      null,
      mockAliases,
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, documentType)

  expect(result).toHaveLength(1)
  expect(result[0].value[0].alias).toBe(mockAliases[mockDictId])
})

test('sorts fields by order property ascending', () => {
  const extractor1 = new LLMExtractor({
    extractorId: 'extractor-sort-1',
    name: 'Sort Extractor 1',
    queries: [
      new LLMExtractionQuery({
        code: 'field-sort-1',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const extractor2 = new LLMExtractor({
    extractorId: 'extractor-sort-2',
    name: 'Sort Extractor 2',
    queries: [
      new LLMExtractionQuery({
        code: 'field-sort-2',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const extractor3 = new LLMExtractor({
    extractorId: 'extractor-sort-3',
    name: 'Sort Extractor 3',
    queries: [
      new LLMExtractionQuery({
        code: 'field-sort-3',
        workflow: {
          nodes: mockQueryNodes,
        },
      }),
    ],
  })

  const documentType = {
    ...mockDocumentType,
    extractionFields: [
      new DocumentTypeField(
        'field-sort-1',
        'Field C',
        {},
        FieldType.STRING,
        false,
        2,
        'document-type-1',
        3,
      ),
      new DocumentTypeField(
        'field-sort-2',
        'Field A',
        {},
        FieldType.STRING,
        false,
        0,
        'document-type-1',
        1,
      ),
      new DocumentTypeField(
        'field-sort-3',
        'Field B',
        {},
        FieldType.STRING,
        false,
        1,
        'document-type-1',
        2,
      ),
    ],
    llmExtractors: [extractor1, extractor2, extractor3],
  }

  const extractedData = [
    new ExtractedDataFieldV2(
      'field-sort-1',
      new FieldData('value C'),
      null,
      false,
    ),
    new ExtractedDataFieldV2(
      'field-sort-2',
      new FieldData('value A'),
      null,
      false,
    ),
    new ExtractedDataFieldV2(
      'field-sort-3',
      new FieldData('value B'),
      null,
      false,
    ),
  ]

  const result = mapGenAiFieldsToStudioFields(extractedData, documentType)

  expect(result).toHaveLength(3)
  expect(result[0].name).toBe('Field A')
  expect(result[0].order).toBe(0)
  expect(result[1].name).toBe('Field B')
  expect(result[1].order).toBe(1)
  expect(result[2].name).toBe('Field C')
  expect(result[2].order).toBe(2)
})
