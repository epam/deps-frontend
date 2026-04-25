
import { useSelector } from 'react-redux'
import { DocumentLayout } from '@/containers/DocumentLayout'
import { TabularLayout } from '@/containers/ParsingLayout/TabularLayout'
import { documentSelector } from '@/selectors/documentReviewPage'

const DocumentParsedData = () => {
  const document = useSelector(documentSelector)

  if (document.parsingInfo?.tabularLayoutInfo) {
    return (
      <TabularLayout
        layoutInfo={document.parsingInfo.tabularLayoutInfo}
      />
    )
  }

  return (
    <DocumentLayout />
  )
}

export {
  DocumentParsedData,
}
