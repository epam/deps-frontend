
import PropTypes from 'prop-types'
import { sourceCharRangeShape } from '@/models/SourceCoordinates'

const SLATE_ELEMENT_TYPE = {
  PARAGRAPH: 'paragraph',
  TABLE: 'table',
  TABLE_ROW: 'table-row',
  TABLE_CELL: 'table-cell',
  IMAGE: 'image',
}

const slateLeafShape = PropTypes.shape({
  text: PropTypes.string.isRequired,
})

const slateAttributesShape = PropTypes.shape({
  ref: PropTypes.shape({
    current: PropTypes.instanceOf(Node),
  }),
})

const slateCellElementShape = PropTypes.shape({
  type: PropTypes.oneOf(Object.values(SLATE_ELEMENT_TYPE)).isRequired,
  attributes: PropTypes.shape({
    rowSpan: PropTypes.number.isRequired,
    colSpan: PropTypes.number.isRequired,
  }).isRequired,
  children: PropTypes.arrayOf(slateLeafShape),
})

const slateRowElementShape = PropTypes.shape({
  type: PropTypes.oneOf(Object.values(SLATE_ELEMENT_TYPE)).isRequired,
  children: PropTypes.arrayOf(slateCellElementShape),
})

const slateTableElementShape = PropTypes.shape({
  type: PropTypes.oneOf(Object.values(SLATE_ELEMENT_TYPE)).isRequired,
  children: PropTypes.arrayOf(slateRowElementShape),
  id: PropTypes.string.isRequired,
})

const slateParagraphElementShape = PropTypes.shape({
  type: PropTypes.oneOf(Object.values(SLATE_ELEMENT_TYPE)).isRequired,
  children: PropTypes.arrayOf(slateLeafShape),
  id: PropTypes.string.isRequired,
  charRanges: PropTypes.arrayOf(sourceCharRangeShape),
})

const slateImageElementShape = PropTypes.shape({
  type: PropTypes.oneOf(Object.values(SLATE_ELEMENT_TYPE)).isRequired,
  url: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(slateLeafShape),
  attributes: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
})

const slateNodeShape = PropTypes.oneOfType([
  slateParagraphElementShape,
  slateTableElementShape,
  slateRowElementShape,
  slateCellElementShape,
  slateImageElementShape,
])

export {
  slateAttributesShape,
  SLATE_ELEMENT_TYPE,
  slateCellElementShape,
  slateRowElementShape,
  slateTableElementShape,
  slateParagraphElementShape,
  slateNodeShape,
  slateImageElementShape,
}
