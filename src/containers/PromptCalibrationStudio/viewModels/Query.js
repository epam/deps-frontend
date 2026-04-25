
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT_NODE_NAME = 'Default'

export class QueryNode {
  constructor ({
    id = uuidv4(),
    name,
    prompt,
  }) {
    this.id = id
    this.name = name
    this.prompt = prompt
  }
}

export const queryNodeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
})

export class Query {
  constructor ({
    id = uuidv4(),
    value = null,
    nodes = [],
    reasoning = null,
    executedNodes,
  } = {}) {
    this.id = id
    this.value = value
    this.nodes = nodes
    this.reasoning = reasoning
    this.executedNodes = executedNodes !== undefined ? executedNodes : nodes
  }

  static updateQuery = ({
    query,
    nodes,
    value,
    reasoning,
    executedNodes,
  }) => (
    new Query({
      ...query,
      nodes,
      value,
      reasoning,
      executedNodes: executedNodes !== undefined ? executedNodes : query.executedNodes,
    })
  )

  static createQueryWithOneNode = (prompt, value, reasoning) => (
    new Query({
      nodes: [
        new QueryNode({
          name: DEFAULT_NODE_NAME,
          prompt,
        }),
      ],
      value,
      reasoning,
    })
  )
}

const keyValuePairValueShape = PropTypes.exact({
  key: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

const listItemShape = PropTypes.shape({
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    keyValuePairValueShape,
  ]),
  alias: PropTypes.string,
})

export const queryShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    keyValuePairValueShape,
    PropTypes.arrayOf(listItemShape),
  ]),
  nodes: PropTypes.arrayOf(queryNodeShape),
  reasoning: PropTypes.string,
  executedNodes: PropTypes.arrayOf(queryNodeShape),
})
