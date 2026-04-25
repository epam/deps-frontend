
import { mockEnv } from '@/mocks/mockEnv'
import {
  MULTIPLICITY,
  Field,
  Query,
  QueryNode,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import {
  LLMExtractionQuery,
  LLMExtractionQueryFormat,
  LLMQueryCardinality,
  FIELD_TYPE_TO_LLM_QUERY_DATA_TYPE,
  LLMExtractionQueryWorkflow,
} from '@/models/LLMExtractor'
import { mapFieldToLLMQuery } from './mapFieldToLLMQuery'

jest.mock('@/utils/env', () => mockEnv)

const mockFieldCode = 'field-code-1'

const mockField = new Field({
  id: 'field-1',
  name: 'Test Field',
  multiplicity: MULTIPLICITY.SINGLE,
  fieldType: FieldType.STRING,
  aliases: true,
  query: new Query({
    nodes: [
      new QueryNode({
        id: 'node-1',
        name: 'Node 1',
        prompt: 'Extract data',
      }),
    ],
  }),
})

test('maps field with single query node correctly', () => {
  const result = mapFieldToLLMQuery(mockFieldCode, mockField)

  expect(result).toBeInstanceOf(LLMExtractionQuery)
  expect(result.code).toBe(mockFieldCode)
  expect(result.shape).toBeInstanceOf(LLMExtractionQueryFormat)
  expect(result.shape.cardinality).toBe(LLMQueryCardinality.SCALAR)
  expect(result.shape.includeAliases).toEqual(true)
  expect(result.shape.dataType).toBe(FIELD_TYPE_TO_LLM_QUERY_DATA_TYPE[FieldType.STRING])
  expect(result.workflow).toBeInstanceOf(LLMExtractionQueryWorkflow)
  expect(result.workflow.nodes).toHaveLength(mockField.query.nodes.length)
  expect(result.workflow.edges).toHaveLength(mockField.query.nodes.length - 1)
})

test('maps field with multiple query nodes and creates edges correctly', () => {
  const field = {
    ...mockField,
    query: new Query({
      nodes: [
        new QueryNode({
          id: 'node-1',
          name: 'Node 1',
          prompt: 'Extract data',
        }),
        new QueryNode({
          id: 'node-2',
          name: 'Node 2',
          prompt: 'Validate data',
        }),
        new QueryNode({
          id: 'node-3',
          name: 'Node 3',
          prompt: 'Transform data',
        }),
      ],
    }),
  }

  const result = mapFieldToLLMQuery(mockFieldCode, field)

  expect(result.workflow.nodes).toHaveLength(field.query.nodes.length)
  expect(result.workflow.edges).toHaveLength(field.query.nodes.length - 1)
})

test('sets cardinality to LIST for multiple multiplicity', () => {
  const field = new Field({
    ...mockField,
    multiplicity: MULTIPLICITY.MULTIPLE,
  })

  const result = mapFieldToLLMQuery(mockFieldCode, field)

  expect(result.shape.cardinality).toBe(LLMQueryCardinality.LIST)
})

test('do not creates edges for one node', () => {
  const fieldSingleNode = new Field({
    ...mockField,
    query: {
      nodes: [
        {
          id: 'node-1',
          name: 'Node 1',
          prompt: 'Extract data',
        },
      ],
    },
  })

  const resultSingle = mapFieldToLLMQuery('field-code-8', fieldSingleNode)
  expect(resultSingle.workflow.edges).toHaveLength(0)
})
