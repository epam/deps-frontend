
const Position = {
  BEFORE: 'before',
  AFTER: 'after',
}

const FORM_FIELD_CODES = {
  NAME: 'name',
  FIELD_TYPE: 'fieldType',
  REQUIRED: 'required',
  EXTRACTOR_ID: 'extractorId',
  LLM_WORKFLOW: 'llmWorkflow',
  CARDINALITY: 'cardinality',
  CONFIDENTIAL: 'confidential',
  INCLUDE_ALIASES: 'includeAliases',
}

const REQUIRED_FIELD_MARKER = '*'

const TEST_ID = {
  NODE_ITEM: 'node-item',
  DELETE_NODE_BUTTON: 'delete-node-button',
  ADD_NEW_NODE_BUTTON: 'add-new-node-button',
  NODES_CONNECTION: 'nodes-connection',
  NODE_VERTICAL_LINE: 'node-vertical-line',
}

export {
  Position,
  FORM_FIELD_CODES,
  REQUIRED_FIELD_MARKER,
  TEST_ID,
}
