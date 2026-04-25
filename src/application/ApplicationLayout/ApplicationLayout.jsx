
import { Layout } from '@/components/Layout'
import { ApplicationFooter } from '@/containers/ApplicationFooter'
import { ApplicationHeader } from '@/containers/ApplicationHeader'
import { ApplicationNavigation } from '@/containers/ApplicationNavigation'
import { childrenShape } from '@/utils/propTypes'

const ApplicationLayout = ({ children }) => (
  <Layout>
    <ApplicationHeader />
    <Layout hasSider>
      <ApplicationNavigation />
      {children}
    </Layout>
    <ApplicationFooter />
  </Layout>
)

export {
  ApplicationLayout,
}

ApplicationLayout.propTypes = {
  children: childrenShape,
}
