
import PropTypes from 'prop-types'
import { useState } from 'react'
import { AddNewNodeButton } from '../AddNewNodeButton'
import { LineContainer, VerticalLine } from './NodesConnectionLine.styles'

export const NodesConnectionLine = ({ onAdd }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => setIsHovered(false)

  return (
    <LineContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {
        isHovered
          ? <AddNewNodeButton onClick={onAdd} />
          : <VerticalLine />
      }
    </LineContainer>
  )
}

NodesConnectionLine.propTypes = {
  onAdd: PropTypes.func.isRequired,
}
