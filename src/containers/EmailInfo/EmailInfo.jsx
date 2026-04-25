
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ButtonType } from '@/components/Button'
import { Expander } from '@/components/Expander'
import { Grid } from '@/components/Grid'
import { TogglerButton } from '@/components/TogglerButton'
import { RESOURCE_EMAIL_PROPERTY, EmailProperty } from '@/enums/EmailHeaderFields'
import { localize, Localization } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { documentSelector } from '@/selectors/documentReviewPage'
import {
  EmailInfoFieldWrapper,
  EmailInfoFieldTitle,
  EmailInfoFieldContent,
  EmailInfoWrapper,
} from './EmailInfo.styles'

const columnsConfig = [
  [
    {
      name: EmailProperty.SENDER,
      visible: () => true,
    },
    {
      name: EmailProperty.RECIPIENTS,
      visible: (collapsed) => !collapsed,
    },
    {
      name: EmailProperty.CC,
      visible: (collapsed) => !collapsed,
    },
    {
      name: EmailProperty.BCC,
      visible: (collapsed) => !collapsed,
    },
  ],
  [
    {
      name: EmailProperty.SUBJECT,
      visible: () => true,
    },
    {
      name: EmailProperty.DATE,
      visible: (collapsed) => !collapsed,
    },
  ],
]
class EmailInfo extends PureComponent {
  static propTypes = {
    document: documentShape.isRequired,
  }

  renderInfoFields = (col, collapsed) => Object.keys(this.props.document.containerMetadata).map((field, index) => {
    const f = col.find((f) => f.name === field)
    if (!f || !f.visible(collapsed)) {
      return null
    }

    let contentValue = !this.props.document.containerMetadata[field]
      ? ''
      : this.props.document.containerMetadata[field]

    if (Array.isArray(contentValue)) {
      contentValue = contentValue.join(', ')
    }

    return (
      <EmailInfoFieldWrapper key={index}>
        <EmailInfoFieldTitle>{RESOURCE_EMAIL_PROPERTY[field]}</EmailInfoFieldTitle>
        <EmailInfoFieldContent>{contentValue}</EmailInfoFieldContent>
      </EmailInfoFieldWrapper>
    )
  })

  render = () => (
    <Expander>
      {
        (collapsed, toggleCollapse) => (
          <>
            <TogglerButton
              block
              collapsed={collapsed}
              onClick={toggleCollapse}
              title={localize(Localization.EMAIL_INFO)}
              type={ButtonType.TEXT}
            />
            <EmailInfoWrapper collapsed={collapsed}>
              {
                columnsConfig.map((col, index) => (
                  <Grid.Column key={index}>{this.renderInfoFields(col, collapsed)}</Grid.Column>
                ))
              }
            </EmailInfoWrapper>
          </>
        )
      }
    </Expander>
  )
}

const mapStateToProps = (state) => ({
  document: documentSelector(state),
})

const ConnectedComponent = connect(mapStateToProps)(EmailInfo)

export {
  ConnectedComponent as EmailInfo,
}
