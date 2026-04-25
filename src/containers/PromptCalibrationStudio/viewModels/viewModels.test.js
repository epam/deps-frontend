
import { mockEnv } from '@/mocks/mockEnv'
import { FieldType } from '@/enums/FieldType'
import { Extractor } from './Extractor'
import {
  Field,
  KeyValuePairValue,
  ListItemValue,
  MULTIPLICITY,
} from './Field'
import { Query } from './Query'

jest.mock('@/utils/env', () => mockEnv)

describe('Extractor', () => {
  describe('isValid', () => {
    test('returns true for valid extractor', () => {
      const extractor = new Extractor({
        id: 'extractor-1',
        customInstruction: 'Test',
        groupingFactor: 1,
        model: 'gpt-4',
        temperature: 0.7,
        topP: 0.9,
      })

      expect(Extractor.isValid(extractor)).toBe(true)
    })

    test('returns false when missing properties', () => {
      const extractor = new Extractor({})

      expect(Extractor.isValid(extractor)).toBe(false)
    })
  })
})

describe('Query', () => {
  describe('constructor', () => {
    test('sets executedNodes to nodes when executedNodes is not provided', () => {
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'some prompt',
        },
      ]

      const query = new Query({ nodes })

      expect(query.executedNodes).toEqual(nodes)
    })

    test('sets executedNodes to provided value when explicitly given', () => {
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'updated prompt',
        },
      ]
      const executedNodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'original prompt',
        },
      ]

      const query = new Query({
        nodes,
        executedNodes,
      })

      expect(query.executedNodes).toEqual(executedNodes)
    })

    test('sets executedNodes to null when explicitly passed as null', () => {
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'some prompt',
        },
      ]

      const query = new Query({
        nodes,
        executedNodes: null,
      })

      expect(query.executedNodes).toBeNull()
    })
  })

  describe('createQueryWithOneNode', () => {
    test('creates a Query with one node and provided prompt', () => {
      const prompt = 'Extract invoice number'
      const value = 'INV-12345'

      const query = Query.createQueryWithOneNode(prompt, value)

      expect(query.id).toBeDefined()
      expect(query.value).toBe('INV-12345')
      expect(query.nodes).toHaveLength(1)
      expect(query.nodes[0].prompt).toBe('Extract invoice number')
      expect(query.nodes[0].id).toBeDefined()
      expect(query.reasoning).toBeNull()
    })
  })

  describe('updateQuery', () => {
    test('updates query with new nodes and value', () => {
      const originalQuery = Query.createQueryWithOneNode('old prompt', 'old value')
      const newNodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'new prompt',
        },
      ]
      const newValue = 'new value'

      const updatedQuery = Query.updateQuery({
        query: originalQuery,
        nodes: newNodes,
        value: newValue,
      })

      expect(updatedQuery.id).toBe(originalQuery.id)
      expect(updatedQuery.nodes).toEqual(newNodes)
      expect(updatedQuery.value).toBe('new value')
      expect(updatedQuery.reasoning).toBeNull()
    })

    test('updates query with new nodes, value and reasoning', () => {
      const originalQuery = Query.createQueryWithOneNode('old prompt', 'old value')
      const newNodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'new prompt',
        },
      ]
      const newValue = 'new value'
      const newReasoning = 'Updated reasoning'

      const updatedQuery = Query.updateQuery({
        query: originalQuery,
        nodes: newNodes,
        value: newValue,
        reasoning: newReasoning,
      })

      expect(updatedQuery.id).toBe(originalQuery.id)
      expect(updatedQuery.nodes).toEqual(newNodes)
      expect(updatedQuery.value).toBe('new value')
      expect(updatedQuery.reasoning).toBe('Updated reasoning')
    })

    test('preserves query id when updating', () => {
      const originalQuery = new Query({
        id: 'query-123',
        value: 'old value',
        nodes: [],
      })
      const newNodes = []
      const newValue = 'new value'

      const updatedQuery = Query.updateQuery({
        query: originalQuery,
        nodes: newNodes,
        value: newValue,
      })

      expect(updatedQuery.id).toBe('query-123')
    })

    test('preserves existing executedNodes when executedNodes is not provided', () => {
      const executedNodes = [
        {
          id: 'old-node',
          name: 'Old Node',
          prompt: 'old prompt',
        },
      ]
      const originalQuery = new Query({
        nodes: [],
        executedNodes,
      })

      const updatedQuery = Query.updateQuery({
        query: originalQuery,
        nodes: [],
        value: null,
      })

      expect(updatedQuery.executedNodes).toEqual(executedNodes)
    })

    test('updates executedNodes when provided', () => {
      const originalQuery = new Query({
        nodes: [],
        executedNodes: [],
      })
      const newExecutedNodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'executed prompt',
        },
      ]

      const updatedQuery = Query.updateQuery({
        query: originalQuery,
        nodes: [],
        value: null,
        executedNodes: newExecutedNodes,
      })

      expect(updatedQuery.executedNodes).toEqual(newExecutedNodes)
    })
  })
})

describe('ListItemValue', () => {
  describe('create', () => {
    test('creates a ListItemValue with given content and null alias', () => {
      const content = 'test content'

      const result = ListItemValue.create(content)

      expect(result.content).toBe(content)
      expect(result.alias).toBeNull()
    })

    test('creates a ListItemValue with empty string content', () => {
      const result = ListItemValue.create('')

      expect(result.content).toBe('')
      expect(result.alias).toBeNull()
    })
  })
})

describe('KeyValuePairValue', () => {
  describe('create', () => {
    test('creates a KeyValuePairValue with given key and value', () => {
      const key = 'testKey'
      const value = 'testValue'

      const result = KeyValuePairValue.create(key, value)

      expect(result.key).toBe(key)
      expect(result.value).toBe(value)
    })

    test('creates a KeyValuePairValue with default empty strings', () => {
      const result = KeyValuePairValue.create()

      expect(result.key).toBe('')
      expect(result.value).toBe('')
    })
  })
})

describe('Field', () => {
  describe('updateFieldValue', () => {
    test('updates field value from query', () => {
      const query = Query.createQueryWithOneNode('prompt', 'query result')
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: 'single',
        name: 'Test Field',
        value: 'old field value',
        query,
      })

      const updatedField = Field.updateFieldValue(field)

      expect(updatedField.query.value).toBeNull()
      expect(updatedField.value).toBe('query result')
      expect(updatedField.query.nodes).toEqual(query.nodes)
    })
  })

  describe('createEmpty', () => {
    test('creates empty Field with DICTIONARY type and single multiplicity', () => {
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.DICTIONARY,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Dictionary Field',
      })

      const result = Field.createEmpty(field)

      expect(result.isNew).toBe(true)
      expect(result.value).toBeInstanceOf(KeyValuePairValue)
      expect(result.value.key).toBe('')
      expect(result.value.value).toBe('')
    })

    test('creates empty Field with DICTIONARY type and multiple multiplicity', () => {
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.DICTIONARY,
        multiplicity: MULTIPLICITY.MULTIPLE,
        name: 'Dictionary Field',
      })

      const result = Field.createEmpty(field)

      expect(result.isNew).toBe(true)
      expect(result.value).toHaveLength(1)
      expect(result.value[0]).toBeInstanceOf(ListItemValue)
    })

    test('creates empty Field with CHECKMARK type and single multiplicity', () => {
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.CHECKMARK,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Checkmark Field',
      })

      const result = Field.createEmpty(field)

      expect(result.isNew).toBe(true)
      expect(result.value).toBeNull()
    })

    test('creates empty Field with CHECKMARK type and multiple multiplicity', () => {
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.CHECKMARK,
        multiplicity: MULTIPLICITY.MULTIPLE,
        name: 'Checkmark Field',
      })

      const result = Field.createEmpty(field)

      expect(result.isNew).toBe(true)
      expect(result.value).toHaveLength(1)
      expect(result.value[0]).toBeInstanceOf(ListItemValue)
      expect(result.value[0].content).toBeNull()
    })

    test('creates empty Field with STRING type and single multiplicity', () => {
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'String Field',
      })

      const result = Field.createEmpty(field)

      expect(result.isNew).toBe(true)
      expect(result.value).toBe('')
    })

    test('creates empty Field with STRING type and multiple multiplicity', () => {
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.MULTIPLE,
        name: 'String Field',
      })

      const result = Field.createEmpty(field)

      expect(result.isNew).toBe(true)
      expect(result.value).toHaveLength(1)
      expect(result.value[0]).toBeInstanceOf(ListItemValue)
      expect(result.value[0].content).toBe('')
    })
  })

  describe('isQueryMutated', () => {
    test('returns false when query.value is null and nodes equal executedNodes', () => {
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'same prompt',
        },
      ]
      const query = new Query({
        value: null,
        nodes,
      })
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Test Field',
        value: 'some value',
        query,
      })

      expect(Field.isQueryMutated(field)).toBe(false)
    })

    test('returns true when field.value differs from query.value', () => {
      const query = new Query({
        value: 'executed value',
        nodes: [],
      })
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Test Field',
        value: 'current value',
        query,
      })

      expect(Field.isQueryMutated(field)).toBe(true)
    })

    test('returns false when field.value equals query.value and nodes are unchanged', () => {
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'prompt',
        },
      ]
      const query = new Query({
        value: 'same value',
        nodes,
        executedNodes: nodes,
      })
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Test Field',
        value: 'same value',
        query,
      })

      expect(Field.isQueryMutated(field)).toBe(false)
    })

    test('returns true when nodes differ from executedNodes', () => {
      const executedNodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'original prompt',
        },
      ]
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'updated prompt',
        },
      ]
      const query = new Query({
        value: null,
        nodes,
        executedNodes,
      })
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Test Field',
        value: 'some value',
        query,
      })

      expect(Field.isQueryMutated(field)).toBe(true)
    })

    test('returns false when executedNodes is null', () => {
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'some prompt',
        },
      ]
      const query = new Query({
        value: null,
        nodes,
        executedNodes: null,
      })
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Test Field',
        value: 'some value',
        query,
      })

      expect(Field.isQueryMutated(field)).toBe(false)
    })
  })

  describe('isChainSameAsExecuted', () => {
    test('returns true when nodes equal executedNodes', () => {
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'prompt',
        },
      ]
      const query = new Query({
        nodes,
        executedNodes: nodes,
      })
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Test Field',
        value: 'value',
        query,
      })

      expect(Field.isChainSameAsExecuted(field)).toBe(true)
    })

    test('returns false when executedNodes is null', () => {
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'some prompt',
        },
      ]
      const query = new Query({
        nodes,
        executedNodes: null,
      })
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Test Field',
        value: 'some value',
        query,
      })

      expect(Field.isChainSameAsExecuted(field)).toBe(false)
    })

    test('returns false when nodes differ from executedNodes', () => {
      const executedNodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'original prompt',
        },
      ]
      const nodes = [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'updated prompt',
        },
      ]
      const query = new Query({
        nodes,
        executedNodes,
      })
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Test Field',
        value: 'some value',
        query,
      })

      expect(Field.isChainSameAsExecuted(field)).toBe(false)
    })

    test('returns false when field has no query', () => {
      const field = new Field({
        id: 'field-1',
        extractorId: 'extractor-1',
        fieldType: FieldType.STRING,
        multiplicity: MULTIPLICITY.SINGLE,
        name: 'Test Field',
        value: 'value',
        query: undefined,
      })

      expect(Field.isChainSameAsExecuted(field)).toBe(false)
    })
  })

  describe('getFieldMultiplicity', () => {
    test('returns MULTIPLE for LIST field type', () => {
      const result = Field.getFieldMultiplicity(FieldType.LIST)

      expect(result).toBe(MULTIPLICITY.MULTIPLE)
    })

    test('returns SINGLE for non-LIST field types', () => {
      const result = Field.getFieldMultiplicity(FieldType.STRING)

      expect(result).toBe(MULTIPLICITY.SINGLE)
    })
  })
})
