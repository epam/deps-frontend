
import PropTypes from 'prop-types'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { imageLayoutShape } from './ImageLayout'
import { keyValuePairLayoutShape } from './KeyValuePairLayout'
import { paragraphLayoutShape } from './ParagraphLayout'
import { tableLayoutShape } from './TableLayout'

class PageLayout {
  constructor ({
    id,
    pageNumber,
    parsingType,
    images,
    paragraphs,
    tables,
    keyValuePairs,
  }) {
    this.id = id
    this.pageNumber = pageNumber
    this.parsingType = parsingType
    this.images = images
    this.paragraphs = paragraphs
    this.tables = tables
    this.keyValuePairs = keyValuePairs
  }
}

const pageLayoutShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  pageNumber: PropTypes.number.isRequired,
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ),
  images: PropTypes.arrayOf(imageLayoutShape),
  paragraphs: PropTypes.arrayOf(paragraphLayoutShape),
  tables: PropTypes.arrayOf(tableLayoutShape),
  keyValuePairs: PropTypes.arrayOf(keyValuePairLayoutShape),
})

export {
  PageLayout,
  pageLayoutShape,
}
