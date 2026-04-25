
import PropTypes from 'prop-types'
import { AgenticAiModes } from '@/enums/AgenticAiModes'
import { toolSetShape } from './ToolSet'

class Mode {
  constructor ({
    code,
    id,
    toolSets,
  }) {
    this.code = code
    this.id = id
    this.toolSets = toolSets
  }
}

const modeShape = PropTypes.shape({
  code: PropTypes.oneOf(Object.values(AgenticAiModes)).isRequired,
  id: PropTypes.string.isRequired,
  toolSets: PropTypes.arrayOf(toolSetShape).isRequired,
})

export {
  Mode,
  modeShape,
}
