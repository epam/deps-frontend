
import PropTypes from 'prop-types'
import { AgenticAiParameters } from '@/enums/AgenticAiParameters'

class ToolParameter {
  constructor ({
    name,
  }) {
    this.name = name
  }
}

const toolParameterShape = PropTypes.shape({
  name: PropTypes.oneOf(Object.values(AgenticAiParameters)).isRequired,
})

class Tool {
  constructor ({
    code,
    name,
    parameters,
  }) {
    this.code = code
    this.name = name
    this.parameters = parameters
  }
}

const toolShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parameters: PropTypes.arrayOf(toolParameterShape).isRequired,
})

class ToolSet {
  constructor ({
    id,
    code,
    name,
    tools,
  }) {
    this.id = id
    this.code = code
    this.name = name
    this.tools = tools
  }
}

const toolSetShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tools: PropTypes.arrayOf(toolShape).isRequired,
})

export {
  ToolParameter,
  Tool,
  ToolSet,
  toolShape,
  toolSetShape,
}
