
import { mockEnv } from '@/mocks/mockEnv'
import { FieldColumn } from '@/containers/DocumentTypeFieldsList/FieldColumn'
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { FieldType } from '@/enums/FieldType'
import { CrossFieldValidator } from '@/models/CrossFieldValidator'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import {
  LLMExtractionParams,
  LLMExtractionQuery,
  LLMExtractionQueryFormat,
  LLMExtractionQueryNode,
  LLMExtractionQueryWorkflow,
  LLMExtractor,
  LLMExtractorPageSpan,
  LLMQueryDataType,
  LLMReference,
} from '@/models/LLMExtractor'
import { Validator, ValidatorRule } from '@/models/Validator'
import {
  mapExtractionFieldsToTableData,
  mapExtraFieldsToTableData,
  attachValidationRulesToField,
} from './fieldsMappers'

jest.mock('@/utils/env', () => mockEnv)

describe('mapExtractionFieldsToTableData', () => {
  const mockExtractionField = new DocumentTypeField(
    'code',
    'Field name',
    {},
    FieldType.STRING,
  )

  const mockLlmExtractor = new LLMExtractor({
    extractorId: 'mockId',
    name: 'LLM Extractor Name 1',
    llmReference: new LLMReference({
      model: 'modelCode',
      provider: 'providerCode',
    }),
    queries: [
      new LLMExtractionQuery({
        code: mockExtractionField.code,
        shape: new LLMExtractionQueryFormat({
          dataType: LLMQueryDataType.STRING,
          cardinality: 'scalar',
          includeAliases: false,
        }),
        workflow: new LLMExtractionQueryWorkflow({
          startNodeId: 'code1',
          endNodeId: 'code2',
          nodes: [
            new LLMExtractionQueryNode({
              id: 'nodeId',
              name: 'node name',
              prompt: 'prompt-value',
            }),
          ],
        }),
      }),
    ],
    extractionParams: new LLMExtractionParams({
      customInstruction: 'Test Instructions 1',
      groupingFactor: 1,
      temperature: 0.5,
      topP: 0.3,
      pageSpan: new LLMExtractorPageSpan({
        start: 1,
        end: 2,
      }),
    }),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('maps fields correctly if fields does not have llmExtractor', () => {
    const result = mapExtractionFieldsToTableData([mockExtractionField], [])

    expect(result).toHaveLength(1)
    expect(result[0][FieldColumn.CATEGORY]).toBe(DocumentTypeFieldCategory.EXTRACTION)
    expect(result[0][FieldColumn.LLM_EXTRACTOR]).toBeUndefined()
    expect(result[0][FieldColumn.PROMPT_CHAIN]).toBeUndefined()
  })

  test('maps fields correctly if fields have llmExtractor', () => {
    const result = mapExtractionFieldsToTableData([mockExtractionField], [mockLlmExtractor])

    expect(result).toHaveLength(1)
    expect(result[0][FieldColumn.CATEGORY]).toBe(DocumentTypeFieldCategory.GEN_AI)
    expect(result[0][FieldColumn.LLM_EXTRACTOR]).toBe(mockLlmExtractor)
    expect(result[0][FieldColumn.PROMPT_CHAIN]).toBe(mockLlmExtractor.queries[0].workflow.nodes)
  })
})

describe('mapExtraFieldsToTableData', () => {
  const mockExtraField = new DocumentTypeExtraField({
    code: 'mockExtraFieldCode',
    name: 'mockExtraFieldName',
    order: 0,
  })

  test('adds EXTRA category to all fields', () => {
    const fields = [mockExtraField]

    const result = mapExtraFieldsToTableData(fields)

    expect(result).toHaveLength(1)
    expect(result[0][FieldColumn.CATEGORY]).toBe(DocumentTypeFieldCategory.EXTRA)
  })
})

describe('attachValidationRulesToField', () => {
  const mockField1 = new DocumentTypeField(
    'code-1',
    'Field name 1',
  )

  const mockField2 = new DocumentTypeField(
    'code-2',
    'Field name 2',
  )

  const mockFieldWithoutValidators = new DocumentTypeField(
    'code-3',
    'Field name 3',
  )

  const mockCrossFieldValidator = new CrossFieldValidator({
    id: 'mockId',
    name: 'Cross Field Validator Name',
    validatedFields: [mockField1.code, mockField2.code],
  })

  const mockValidatorRule = new ValidatorRule({
    name: 'Validator Rule Name',
  })

  const mockValidator = new Validator({
    code: mockField1.code,
    rules: [mockValidatorRule],
  })

  test('maps validators to table data correctly if field has Validator and Cross Field Validator', () => {
    const result = attachValidationRulesToField(mockField1, [mockValidator], [mockCrossFieldValidator])
    const validatorRulesColumn = result[FieldColumn.VALIDATION_RULES]

    expect(validatorRulesColumn).toHaveLength(2)
    expect(validatorRulesColumn[0]).toBe(mockValidatorRule)
    expect(validatorRulesColumn[1]).toBe(mockCrossFieldValidator)
  })

  test('maps validators to table data correctly if field does not have validators', () => {
    const result = attachValidationRulesToField(mockFieldWithoutValidators, [mockValidator], [mockCrossFieldValidator])
    const validatorRulesColumn = result[FieldColumn.VALIDATION_RULES]

    expect(validatorRulesColumn).toHaveLength(0)
  })
})
