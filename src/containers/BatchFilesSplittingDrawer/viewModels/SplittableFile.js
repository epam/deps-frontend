
import PropTypes from 'prop-types'
import { pdfSegmentShape } from '@/containers/PdfSplitting/models'

export class SplittableFile {
  constructor ({
    source,
    segments,
    batchName = null,
  }) {
    this.source = source
    this.segments = segments
    this.batchName = batchName
  }

  static setSegments = (splittableFile, segments) => (
    new SplittableFile({
      ...splittableFile,
      segments,
    })
  )
}

export const splittableFileShape = PropTypes.shape({
  source: PropTypes.string.isRequired,
  segments: PropTypes.arrayOf(pdfSegmentShape).isRequired,
  batchName: PropTypes.string,
})
