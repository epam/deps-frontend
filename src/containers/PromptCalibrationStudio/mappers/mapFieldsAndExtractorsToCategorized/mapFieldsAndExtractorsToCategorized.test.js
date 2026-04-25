
import { mockEnv } from '@/mocks/mockEnv'
import { Extractor, Field, Query } from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { mapFieldsAndExtractorsToCategorized } from './mapFieldsAndExtractorsToCategorized'

jest.mock('@/utils/env', () => mockEnv)

test('categorizes newly created fields', () => {
  const initialFields = []
  const currentFields = [
    new Field({
      id: 'field-1',
      name: 'New Field',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: new Query(),
      value: '',
    }),
  ]

  const result = mapFieldsAndExtractorsToCategorized({
    currentFields,
    initialFields,
    currentExtractors: [],
    initialExtractors: [],
  })

  expect(result.categorizedFields.created).toHaveLength(1)
  expect(result.categorizedFields.created[0].id).toBe('field-1')
  expect(result.categorizedFields.updated).toHaveLength(0)
})

test('categorizes updated fields', () => {
  const initialFields = [
    new Field({
      id: 'field-1',
      name: 'Original Name',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: new Query(),
      value: '',
    }),
  ]
  const currentFields = [
    new Field({
      id: 'field-1',
      name: 'Updated Name',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: new Query(),
      value: '',
    }),
  ]

  const result = mapFieldsAndExtractorsToCategorized({
    currentFields,
    initialFields,
    currentExtractors: [],
    initialExtractors: [],
  })

  expect(result.categorizedFields.created).toHaveLength(0)
  expect(result.categorizedFields.updated).toHaveLength(1)
  expect(result.categorizedFields.updated[0].name).toBe('Updated Name')
})

test('does not categorize unchanged fields as updated', () => {
  const field = new Field({
    id: 'field-1',
    name: 'Same Field',
    fieldType: FieldType.STRING,
    multiplicity: 'single',
    extractorId: 'extractor-1',
    query: new Query(),
    value: '',
  })
  const initialFields = [field]
  const currentFields = [field]

  const result = mapFieldsAndExtractorsToCategorized({
    currentFields,
    initialFields,
    currentExtractors: [],
    initialExtractors: [],
  })

  expect(result.categorizedFields.created).toHaveLength(0)
  expect(result.categorizedFields.updated).toHaveLength(0)
})

test('handles mixed field states', () => {
  const sharedQuery1 = new Query()
  const sharedQuery2Initial = new Query()
  const sharedQuery2Updated = new Query()

  const initialFields = [
    new Field({
      id: 'field-1',
      name: 'Unchanged Field',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: sharedQuery1,
      value: '',
    }),
    new Field({
      id: 'field-2',
      name: 'Original Name',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: sharedQuery2Initial,
      value: '',
    }),
  ]
  const currentFields = [
    new Field({
      id: 'field-1',
      name: 'Unchanged Field',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: sharedQuery1,
      value: '',
    }),
    new Field({
      id: 'field-2',
      name: 'Updated Name',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: sharedQuery2Updated,
      value: '',
    }),
    new Field({
      id: 'field-3',
      name: 'New Field',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: new Query(),
      value: '',
    }),
  ]

  const result = mapFieldsAndExtractorsToCategorized({
    currentFields,
    initialFields,
    currentExtractors: [],
    initialExtractors: [],
  })

  expect(result.categorizedFields.created).toHaveLength(1)
  expect(result.categorizedFields.created[0].id).toBe('field-3')
  expect(result.categorizedFields.updated).toHaveLength(1)
  expect(result.categorizedFields.updated[0].id).toBe('field-2')
})

test('categorizes newly created extractors', () => {
  const initialExtractors = []
  const currentExtractors = [
    new Extractor({
      id: 'extractor-1',
      name: 'New Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
      customInstruction: 'Extract data',
    }),
  ]

  const result = mapFieldsAndExtractorsToCategorized({
    currentFields: [],
    initialFields: [],
    currentExtractors,
    initialExtractors,
  })

  expect(result.categorizedExtractors.created).toHaveLength(1)
  expect(result.categorizedExtractors.created[0].id).toBe('extractor-1')
  expect(result.categorizedExtractors.updated).toHaveLength(0)
})

test('categorizes updated extractors', () => {
  const initialExtractors = [
    new Extractor({
      id: 'extractor-1',
      name: 'Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
      customInstruction: 'Original instruction',
    }),
  ]
  const currentExtractors = [
    new Extractor({
      id: 'extractor-1',
      name: 'Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
      customInstruction: 'Updated instruction',
    }),
  ]

  const result = mapFieldsAndExtractorsToCategorized({
    currentFields: [],
    initialFields: [],
    currentExtractors,
    initialExtractors,
  })

  expect(result.categorizedExtractors.created).toHaveLength(0)
  expect(result.categorizedExtractors.updated).toHaveLength(1)
  expect(result.categorizedExtractors.updated[0].customInstruction).toBe('Updated instruction')
})

test('does not categorize unchanged extractors as updated', () => {
  const extractor = new Extractor({
    id: 'extractor-1',
    name: 'Extractor',
    model: 'openai@gpt-4',
    temperature: 0.7,
    topP: 1,
    groupingFactor: 1,
    customInstruction: 'Extract data',
  })
  const initialExtractors = [extractor]
  const currentExtractors = [extractor]

  const result = mapFieldsAndExtractorsToCategorized({
    currentFields: [],
    initialFields: [],
    currentExtractors,
    initialExtractors,
  })

  expect(result.categorizedExtractors.created).toHaveLength(0)
  expect(result.categorizedExtractors.updated).toHaveLength(0)
})

test('handles mixed extractor states', () => {
  const initialExtractors = [
    new Extractor({
      id: 'extractor-1',
      name: 'Unchanged Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
    }),
    new Extractor({
      id: 'extractor-2',
      name: 'Original Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
    }),
  ]
  const currentExtractors = [
    new Extractor({
      id: 'extractor-1',
      name: 'Unchanged Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
    }),
    new Extractor({
      id: 'extractor-2',
      name: 'Updated Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
    }),
    new Extractor({
      id: 'extractor-3',
      name: 'New Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
    }),
  ]

  const result = mapFieldsAndExtractorsToCategorized({
    currentFields: [],
    initialFields: [],
    currentExtractors,
    initialExtractors,
  })

  expect(result.categorizedExtractors.created).toHaveLength(1)
  expect(result.categorizedExtractors.created[0].id).toBe('extractor-3')
  expect(result.categorizedExtractors.updated).toHaveLength(1)
  expect(result.categorizedExtractors.updated[0].id).toBe('extractor-2')
})

test('categorizes both fields and extractors correctly', () => {
  const sharedQuery = new Query()

  const initialFields = [
    new Field({
      id: 'field-1',
      name: 'Field',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: sharedQuery,
      value: '',
    }),
  ]
  const currentFields = [
    new Field({
      id: 'field-1',
      name: 'Updated Field',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: sharedQuery,
      value: '',
    }),
    new Field({
      id: 'field-2',
      name: 'New Field',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      extractorId: 'extractor-1',
      query: new Query(),
      value: '',
    }),
  ]

  const initialExtractors = [
    new Extractor({
      id: 'extractor-1',
      name: 'Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
    }),
  ]
  const currentExtractors = [
    new Extractor({
      id: 'extractor-1',
      name: 'Updated Extractor',
      model: 'openai@gpt-4',
      temperature: 0.7,
      topP: 1,
      groupingFactor: 1,
    }),
    new Extractor({
      id: 'extractor-2',
      name: 'New Extractor',
      model: 'openai@gpt-4',
      temperature: 0.5,
      topP: 1,
      groupingFactor: 1,
    }),
  ]

  const result = mapFieldsAndExtractorsToCategorized({
    currentFields,
    initialFields,
    currentExtractors,
    initialExtractors,
  })

  expect(result.categorizedFields.created).toHaveLength(1)
  expect(result.categorizedFields.updated).toHaveLength(1)
  expect(result.categorizedFields.updated[0].name).toBe('Updated Field')

  expect(result.categorizedExtractors.created).toHaveLength(1)
  expect(result.categorizedExtractors.updated).toHaveLength(1)
  expect(result.categorizedExtractors.updated[0].name).toBe('Updated Extractor')
})
