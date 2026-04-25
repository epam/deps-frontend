
import PropTypes from 'prop-types'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { ReferenceLayoutState } from '@/enums/ReferenceLayoutState'
import { unifiedDataShape } from '@/models/Document'

class ReferenceLayout {
  constructor ({
    id,
    blobName,
    documentLayoutData,
    prototypeId,
    state,
    title,
    unifiedData,
  }) {
    this.id = id
    this.blobName = blobName
    this.documentLayoutData = documentLayoutData
    this.prototypeId = prototypeId
    this.state = state
    this.title = title
    this.unifiedData = unifiedData
  }

  static getDocumentLayoutId = (layout) => layout.documentLayoutData.documentLayoutId
}

const referenceLayoutShape = PropTypes.exact({
  id: PropTypes.string.isRequired,
  blobName: PropTypes.string.isRequired,
  prototypeId: PropTypes.string.isRequired,
  documentLayoutData: PropTypes.shape({
    documentLayoutId: PropTypes.string,
    parsingFeatures: PropTypes.shape({
      [PropTypes.oneOf(
        Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
      )]: PropTypes.oneOf(
        Object.values(KnownParsingFeature),
      ),
    }),
  }),
  state: PropTypes.oneOf(
    Object.values(ReferenceLayoutState),
  ).isRequired,
  title: PropTypes.string.isRequired,
  unifiedData: unifiedDataShape,
})

export {
  ReferenceLayout,
  referenceLayoutShape,
}
