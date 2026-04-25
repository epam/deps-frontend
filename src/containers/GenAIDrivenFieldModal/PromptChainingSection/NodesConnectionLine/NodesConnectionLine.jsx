
import PropTypes from 'prop-types'
import { useState } from 'react'
import { TEST_ID } from '@/containers/GenAIDrivenFieldModal/constants'
import { AddNewNodeButton } from '../AddNewNodeButton'
import { LineContainer, VerticalLine } from './NodesConnectionLine.styles'

const NodesConnectionLine = ({ onAdd }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <LineContainer
      data-testid={TEST_ID.NODES_CONNECTION}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {
        isHovered
          ? <AddNewNodeButton onClick={onAdd} />
          : <VerticalLine data-testid={TEST_ID.NODE_VERTICAL_LINE} />
      }
    </LineContainer>
  )
}

NodesConnectionLine.propTypes = {
  onAdd: PropTypes.func.isRequired,
}

export {
  NodesConnectionLine,
}
