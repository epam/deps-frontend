
import { MULTIPLICITY } from '@/containers/PromptCalibrationStudio/viewModels'
import {
  LLMExtractionQuery,
  LLMExtractionQueryFormat,
  LLMQueryCardinality,
  FIELD_TYPE_TO_LLM_QUERY_DATA_TYPE,
  LLMExtractionQueryNode,
  LLMExtractionQueryEdge,
  LLMExtractionQueryWorkflow,
} from '@/models/LLMExtractor'

export const mapFieldToLLMQuery = (fieldCode, field) => {
  const {
    multiplicity,
    fieldType: baseType,
    aliases,
    query,
  } = field

  const isMultiple = multiplicity === MULTIPLICITY.MULTIPLE

  const workflowNodes = query.nodes.map(({ id, name, prompt }) => (
    new LLMExtractionQueryNode({
      id,
      name,
      prompt,
    })
  ))

  const workflowEdges = workflowNodes.length > 1
    ? workflowNodes.slice(0, -1).map((node, idx) => (
      new LLMExtractionQueryEdge({
        sourceId: node.id,
        targetId: workflowNodes[idx + 1].id,
      })
    ))
    : []

  const workflow = new LLMExtractionQueryWorkflow({
    startNodeId: workflowNodes[0].id,
    endNodeId: workflowNodes[workflowNodes.length - 1].id,
    nodes: workflowNodes,
    edges: workflowEdges,
  })

  return new LLMExtractionQuery({
    code: fieldCode,
    shape: new LLMExtractionQueryFormat({
      cardinality: isMultiple ? LLMQueryCardinality.LIST : LLMQueryCardinality.SCALAR,
      includeAliases: aliases,
      dataType: FIELD_TYPE_TO_LLM_QUERY_DATA_TYPE[baseType],
    }),
    workflow,
  })
}
