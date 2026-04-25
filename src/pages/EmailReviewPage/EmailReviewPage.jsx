
import { connect } from 'react-redux'
import { Content } from '@/components/Layout'
import { DocumentViewHeader } from '@/containers/DocumentViewHeader'
import { EmailAttachments } from '@/containers/EmailAttachments'
import { EmailBody } from '@/containers/EmailBody'
import { EmailInfo } from '@/containers/EmailInfo'
import { documentShape } from '@/models/Document'
import { documentSelector } from '@/selectors/documentReviewPage'
import { Wrapper } from './EmailReviewPage.styles'

const EmailReviewPage = ({
  document,
}) => (
  <Content>
    <DocumentViewHeader document={document} />
    <Wrapper>
      <EmailInfo />
      <EmailBody />
      <EmailAttachments />
    </Wrapper>
  </Content>
)

EmailReviewPage.propTypes = {
  document: documentShape.isRequired,
}

const mapStateToProps = (state) => ({
  document: documentSelector(state),
})

const ConnectedComponent = connect(mapStateToProps)(EmailReviewPage)

export {
  ConnectedComponent as EmailReviewPage,
}
