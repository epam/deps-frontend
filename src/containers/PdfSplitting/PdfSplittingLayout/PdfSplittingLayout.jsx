
import PropTypes from 'prop-types'
import { usePdfSegments } from '../hooks'
import { PdfSegments } from '../PdfSegments'
import { PdfThumbnailsMap } from '../PdfThumbnailsMap'
import { PdfSegmentsProvider } from '../providers'
import { Wrapper } from './PdfSplittingLayout.styles'

const PdfSplittingLayout = ({ pdfFile }) => {
  const { segments } = usePdfSegments()

  return (
    <Wrapper>
      <PdfThumbnailsMap pdfFile={pdfFile} />
      {
        !!segments.length && (
          <PdfSegments />
        )
      }
    </Wrapper>
  )
}

PdfSplittingLayout.propTypes = {
  pdfFile: PropTypes.instanceOf(Blob).isRequired,
}

const PdfSplittingLayoutWithProvider = ({ pdfFile, ...rest }) => {
  return (
    <PdfSegmentsProvider {...rest}>
      <PdfSplittingLayout pdfFile={pdfFile} />
    </PdfSegmentsProvider>
  )
}

PdfSplittingLayoutWithProvider.propTypes = {
  pdfFile: PropTypes.instanceOf(Blob),
}

export { PdfSplittingLayoutWithProvider as PdfSplittingLayout }
