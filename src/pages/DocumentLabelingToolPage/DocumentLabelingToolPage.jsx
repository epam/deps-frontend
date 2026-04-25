
import { useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ApplicationFooter } from '@/containers/ApplicationFooter'
import { DocumentLabelingTool } from '@/containers/DocumentLabelingTool'

const DocumentLabelingToolPage = () => (
  <Layout>
    <DocumentLabelingTool
      documentId={useParams().documentId}
    />
    <ApplicationFooter />
  </Layout>
)

export {
  DocumentLabelingToolPage,
}
