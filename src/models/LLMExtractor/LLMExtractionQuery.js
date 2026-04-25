
import PropTypes from 'prop-types'
import { FieldType } from '@/enums/FieldType'

const LLMQueryDataType = {
  STRING: 'String',
  BOOLEAN: 'Boolean',
  KAY_VALUE_PAIR: 'KeyValuePair',
}

const FIELD_TYPE_TO_LLM_QUERY_DATA_TYPE = {
  [FieldType.STRING]: LLMQueryDataType.STRING,
  [FieldType.CHECKMARK]: LLMQueryDataType.BOOLEAN,
  [FieldType.DICTIONARY]: LLMQueryDataType.KAY_VALUE_PAIR,
}

const LLMQueryCardinality = {
  LIST: 'list',
  SCALAR: 'scalar',
}

class LLMExtractionQuery {
  constructor ({
    code,
    shape,
    workflow,
  }) {
    this.code = code
    this.shape = shape
    this.workflow = workflow
  }
}

class LLMExtractionQueryWorkflow {
  constructor ({
    startNodeId,
    endNodeId,
    nodes,
    edges,
  }) {
    this.startNodeId = startNodeId
    this.endNodeId = endNodeId
    this.nodes = nodes
    this.edges = edges
  }
}

class LLMExtractionQueryFormat {
  constructor ({
    cardinality,
    includeAliases,
    dataType,
  }) {
    this.cardinality = cardinality
    this.includeAliases = includeAliases
    this.dataType = dataType
  }
}

class LLMExtractionQueryNode {
  constructor ({
    id,
    name,
    prompt,
  }) {
    this.id = id
    this.name = name
    this.prompt = prompt
  }
}

class LLMExtractionQueryEdge {
  constructor ({
    sourceId,
    targetId,
  }) {
    this.sourceId = sourceId
    this.targetId = targetId
  }
}

const llmExtractionQueryNodeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
})

const llmExtractionQueryWorkflowShape = PropTypes.shape({
  startNodeId: PropTypes.string.isRequired,
  endNodeId: PropTypes.string.isRequired,
  nodes: PropTypes.arrayOf(llmExtractionQueryNodeShape).isRequired,
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      sourceId: PropTypes.string,
      targetId: PropTypes.string,
    }),
  ).isRequired,
})

const llmExtractionQueryFormatShape = PropTypes.shape({
  cardinality: PropTypes.oneOf(Object.values(LLMQueryCardinality)).isRequired,
  includeAliases: PropTypes.bool.isRequired,
  dataType: PropTypes.oneOf(Object.values(LLMQueryDataType)).isRequired,
})

const llmExtractionQueryShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  shape: llmExtractionQueryFormatShape.isRequired,
  workflow: llmExtractionQueryWorkflowShape.isRequired,
})

export {
  LLMExtractionQuery,
  LLMExtractionQueryNode,
  LLMExtractionQueryEdge,
  LLMExtractionQueryWorkflow,
  LLMExtractionQueryFormat,
  LLMQueryCardinality,
  llmExtractionQueryNodeShape,
  llmExtractionQueryWorkflowShape,
  llmExtractionQueryFormatShape,
  llmExtractionQueryShape,
  LLMQueryDataType,
  FIELD_TYPE_TO_LLM_QUERY_DATA_TYPE,
}
