
import { useSelector } from 'react-redux'
import { Button } from '@/components/Button'
import { Tooltip } from '@/components/Tooltip'
import { FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { documentSelector } from '@/selectors/documentReviewPage'
import { getFileExtension } from '@/utils/getFileExtension'
import { PdfSplittingButton } from '../PdfSplittingButton'
import { PdfSegmentsProvider } from '../providers'

export const PdfSplittingButtonWrapper = () => {
  const [file] = useSelector(documentSelector).files

  const isExtensionPdf = getFileExtension(file.blobName) === FileExtension.PDF

  if (!isExtensionPdf) {
    return (
      <Tooltip
        title={localize(Localization.SPLITTING_AVAILABLE_FOR_PDF)}
      >
        <Button.Text disabled>
          {localize(Localization.SPLIT_DOCUMENT)}
        </Button.Text>
      </Tooltip>
    )
  }

  return (
    <PdfSegmentsProvider>
      <PdfSplittingButton />
    </PdfSegmentsProvider>
  )
}
