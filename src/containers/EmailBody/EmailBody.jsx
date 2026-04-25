
import { connect } from 'react-redux'
import sanitizeHtml from 'sanitize-html'
import { ButtonType } from '@/components/Button'
import { Expander } from '@/components/Expander'
import { TogglerButton } from '@/components/TogglerButton'
import { localize, Localization } from '@/localization/i18n'
import { emailShape } from '@/models/Email'
import { Link } from '@/pages/EmailReviewPage/Link.styles'
import { documentSelector } from '@/selectors/documentReviewPage'
import {
  EmailBodyWrapper,
  EmailBodyContent,
  EmailEmptyBody,
} from './EmailBody.styles'

const EmailBody = ({
  document,
}) => (
  <Expander>
    {
      (collapsed, toggleCollapse) => (
        <>
          <TogglerButton
            block
            collapsed={collapsed}
            onClick={toggleCollapse}
            title={localize(Localization.EMAIL_BODY_NAME)}
            type={ButtonType.TEXT}
          />
          <EmailBodyWrapper>
            {
              document.containerMetadata?.body ? (
                <>
                  <EmailBodyContent
                    collapsed={collapsed}
                    dangerouslySetInnerHTML={
                      {
                        __html: sanitizeHtml(document.containerMetadata.body, {
                          allowedAttributes: {
                            '*': ['style'],
                          },
                        }),
                      }
                    }
                  />
                  {
                    collapsed && (
                      <Link
                        onClick={toggleCollapse}
                      >
                        {localize(Localization.READ_MORE)}
                      </Link>
                    )
                  }
                </>
              )
                : (
                  <EmailEmptyBody>
                    {localize(Localization.EMPTY_EMAIL_TEXT)}
                  </EmailEmptyBody>
                )
            }
          </EmailBodyWrapper>
        </>
      )
    }
  </Expander>
)

EmailBody.propTypes = {
  document: emailShape.isRequired,
}

const mapStateToProps = (state) => ({
  document: documentSelector(state),
})

const ConnectedComponent = connect(mapStateToProps)(EmailBody)

export {
  ConnectedComponent as EmailBody,
}
