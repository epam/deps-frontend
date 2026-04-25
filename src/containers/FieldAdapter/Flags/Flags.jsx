
import PropTypes from 'prop-types'
import { commentShape } from '@/models/Comment'
import { CommentsFlag } from './CommentsFlag'
import { ConfidenceFlag } from './ConfidenceFlag'
import { FlagWrapper } from './Flags.styles'
import { ModifiedByFlag } from './ModifiedByFlag'

const Flags = (props) => {
  const {
    comments,
    confidence,
    modifiedBy,
  } = props

  const shouldRenderConfidenceFlags = 'confidence' in props

  return (
    <FlagWrapper>
      <CommentsFlag comments={comments} />
      {
        shouldRenderConfidenceFlags &&
        <ConfidenceFlag confidence={confidence} />
      }
      <ModifiedByFlag modifiedBy={modifiedBy} />
    </FlagWrapper>
  )
}

Flags.propTypes = {
  comments: PropTypes.arrayOf(commentShape),
  confidence: PropTypes.number,
  modifiedBy: PropTypes.string,
}

export { Flags }
