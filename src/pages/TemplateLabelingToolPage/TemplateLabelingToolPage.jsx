
import { useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ApplicationFooter } from '@/containers/ApplicationFooter'
import { TemplateLabelingTool } from '@/containers/TemplateLabelingTool'

const TemplateLabelingToolPage = () => {
  const { id, versionId } = useParams()

  return (
    <Layout>
      <TemplateLabelingTool
        templateId={id}
        versionId={versionId}
      />
      <ApplicationFooter />
    </Layout>
  )
}

export {
  TemplateLabelingToolPage,
}
