
import PropTypes from 'prop-types'
import { memo, Fragment } from 'react'
import { connect } from 'react-redux'
import { UiKeys } from '@/constants/navigation'
import { slateAttributesShape } from '@/containers/Slate/models'
import { highlightedTextCoordsShape } from '@/models/HighlightedField'
import { sourceCharRangeShape, SourceTextCoordinates } from '@/models/SourceCoordinates'
import { uiSelector } from '@/selectors/navigation'
import { highlightedFieldSelector } from '@/selectors/reviewPage'
import { childrenShape } from '@/utils/propTypes'
import { HighlightedLetter } from './Word.styles'

const Word = ({
  attributes,
  children,
  leaf,
  activeSourceId,
  highlightedField,
}) => {
  const getWordRangeToHighlight = () => (
    highlightedField.flat().find((range) => SourceTextCoordinates.isInRange(leaf.charRange, range))
  )

  const getRelativeRangeToHighlight = (highlightRange) => {
    const { charRange, text } = leaf
    const lastIndexOfText = text.length - 1

    return {
      begin: highlightRange.begin - charRange.begin,
      end: lastIndexOfText - (charRange.end - highlightRange.end),
    }
  }

  const renderWordWithHighlight = () => {
    const highlightRange = getWordRangeToHighlight()

    if (!highlightRange) {
      return children
    }

    const { begin, end } = getRelativeRangeToHighlight(highlightRange)

    return leaf.text.split('').map((letter, index) => {
      if (index >= begin && index <= end) {
        return <HighlightedLetter key={index}>{letter}</HighlightedLetter>
      }

      return <Fragment key={index}>{letter}</Fragment>
    })
  }

  const renderContent = () => {
    if (
      (activeSourceId === children.props.parent.id) &&
      highlightedField
    ) {
      return renderWordWithHighlight()
    }

    return children
  }

  return (
    <span {...attributes}>
      {renderContent()}
    </span>
  )
}

Word.propTypes = {
  children: childrenShape.isRequired,
  attributes: slateAttributesShape.isRequired,
  highlightedField: highlightedTextCoordsShape,
  activeSourceId: PropTypes.string,
  leaf: PropTypes.shape({
    text: PropTypes.string,
    charRange: sourceCharRangeShape,
  }).isRequired,
}

const comparer = (prevProps, nextProps) => {
  const areWordCoordsInHighlightedRange = nextProps.highlightedField?.flat()
    .some((range) => SourceTextCoordinates.isInRange(nextProps.leaf.charRange, range))

  const isWordInActiveParagraph = nextProps.activeSourceId === nextProps.children.props.parent.id
  const areWordCoordsWereInHighlightedRange = prevProps.highlightedField?.flat()
    .some((range) => SourceTextCoordinates.isInRange(prevProps.leaf.charRange, range))

  return !(
    (
      areWordCoordsInHighlightedRange &&
      isWordInActiveParagraph
    ) ||
    areWordCoordsWereInHighlightedRange
  )
}

const mapStateToProps = (state) => ({
  activeSourceId: uiSelector(state)[UiKeys.ACTIVE_SOURCE_ID],
  highlightedField: highlightedFieldSelector(state),
})

const memoizedWord = memo(Word, comparer)

const ConnectedComponent = connect(mapStateToProps)(memoizedWord)

export {
  ConnectedComponent as Word,
}
