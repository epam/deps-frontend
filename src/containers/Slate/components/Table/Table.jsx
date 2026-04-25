
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { UiKeys } from '@/constants/navigation'
import { slateAttributesShape, slateTableElementShape } from '@/containers/Slate/models'
import { uiSelector } from '@/selectors/navigation'
import { childrenShape } from '@/utils/propTypes'
import { StyledTable } from './Table.styles'

const Table = ({ attributes, children, activeSourceId, element }) => {
  useEffect(() => {
    if (activeSourceId !== element.id) {
      return
    }
    attributes.ref?.current.scrollIntoView()
  }, [activeSourceId, element, attributes])

  return (
    <StyledTable>
      <tbody {...attributes}>
        {children}
      </tbody>
    </StyledTable>
  )
}

const mapStateToProps = (state) => ({
  activeSourceId: uiSelector(state)[UiKeys.ACTIVE_SOURCE_ID],
})

const ConnectedComponent = connect(mapStateToProps)(Table)

Table.propTypes = {
  attributes: slateAttributesShape,
  children: childrenShape.isRequired,
  activeSourceId: PropTypes.string,
  element: slateTableElementShape,
}

export { ConnectedComponent as Table }
