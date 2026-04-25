
import PropTypes from 'prop-types'
import { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { UiKeys } from '@/constants/navigation'
import { slateAttributesShape, slateParagraphElementShape } from '@/containers/Slate/models'
import { uiSelector } from '@/selectors/navigation'
import { childrenShape } from '@/utils/propTypes'
import { Word } from '../Word'

const SPACE_SYMBOL = ' '

const Paragraph = ({
  attributes,
  children,
  activeSourceId,
  element,
}) => {
  const renderWord = (content) => (
    <Fragment key={content.key}>
      <Word leaf={content.props.text}>
        {content}
      </Word>
      {SPACE_SYMBOL}
    </Fragment>
  )

  useEffect(() => {
    if (activeSourceId !== element.id) {
      return
    }

    attributes.ref?.current.scrollIntoView()
  }, [activeSourceId, element, attributes])

  return (
    <p {...attributes}>
      {children.map(renderWord)}
    </p>
  )
}

Paragraph.propTypes = {
  attributes: slateAttributesShape.isRequired,
  children: childrenShape.isRequired,
  activeSourceId: PropTypes.string,
  element: slateParagraphElementShape.isRequired,
}

const mapStateToProps = (state) => ({
  activeSourceId: uiSelector(state)[UiKeys.ACTIVE_SOURCE_ID],
})

const ConnectedComponent = connect(mapStateToProps)(Paragraph)

export {
  ConnectedComponent as Paragraph,
}
