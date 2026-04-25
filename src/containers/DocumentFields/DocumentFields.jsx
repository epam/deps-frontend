
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NoData } from '@/components/NoData'
import { UiKeys } from '@/constants/navigation'
import { FieldAdapter } from '@/containers/FieldAdapter'
import { DocumentState } from '@/enums/DocumentState'
import { FieldType } from '@/enums/FieldType'
import { localize, Localization } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { DocumentValidation } from '@/models/DocumentValidation'
import { extendedDocumentTypeShape } from '@/models/ExtendedDocumentType'
import { extractedDataFieldShape } from '@/models/ExtractedData'
import { LLMExtractor, LLMExtractors } from '@/models/LLMExtractor'
import {
  activeFieldTypesSelector,
  documentSelector,
  documentTypeSelector,
} from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { isDocumentDataFetchingSelector } from '@/selectors/requests'
import { ENV } from '@/utils/env'
import { LocalBoundary } from './DocumentFields.styles'

class DocumentFields extends PureComponent {
  static propTypes = {
    activeFieldPk: PropTypes.oneOfType([
      PropTypes.number.isRequired,
      PropTypes.string.isRequired,
    ]),
    fields: PropTypes.arrayOf(
      extractedDataFieldShape,
    ).isRequired,
    document: documentShape.isRequired,
    documentType: extendedDocumentTypeShape.isRequired,
    fetching: PropTypes.bool.isRequired,
    activeFieldTypes: PropTypes.arrayOf(
      PropTypes.oneOf(Object.values(FieldType)),
    ).isRequired,
  }

  isActive = (edField) => edField.fieldPk === this.props.activeFieldPk

  isReviewDisabled = (dtField) => {
    const { document, documentType, fetching } = this.props
    return (
      document.state !== DocumentState.IN_REVIEW ||
      !documentType ||
      documentType === UNKNOWN_DOCUMENT_TYPE ||
      fetching ||
      (ENV.FEATURE_FIELDS_DISPLAY_MODE && dtField.readOnly)
    )
  }

  getVisibleFields = () => this.props.fields.filter((f) => {
    const dtField = this.props.documentType.fields.find((dtf) => dtf.pk === f.fieldPk)
    return (
      this.props.activeFieldTypes.includes(dtField.fieldType) ||
      this.props.activeFieldTypes.includes(dtField.fieldMeta.baseType)
    )
  })

  renderLocalBoundary = (fieldCode, fieldName) => (
    <LocalBoundary>
      {
        localize(Localization.LOCAL_BOUNDARY_TITLE, {
          fieldCode,
          fieldName,
        })
      }
    </LocalBoundary>
  )

  renderField = (edField) => {
    const dtField = this.props.documentType.fields.find((dtf) => dtf.pk === edField.fieldPk)
    const fieldValidation = DocumentValidation.getFieldValidation(this.props.document.validation, dtField.code)
    const fieldExtractor = LLMExtractors.getExtractorByQueryCode(dtField.code, this.props.documentType.llmExtractors)
    const promptChain = fieldExtractor && LLMExtractor.getQueryNodesFromExtractor(dtField.code, fieldExtractor)

    return (
      <ErrorBoundary
        key={dtField.code}
        localBoundary={() => this.renderLocalBoundary(dtField.code, dtField.name)}
      >
        <FieldAdapter
          active={this.isActive(edField)}
          disabled={this.isReviewDisabled(dtField)}
          dtField={dtField}
          edField={edField}
          promptChain={promptChain}
          validation={fieldValidation}
        />
      </ErrorBoundary>
    )
  }

  render = () => {
    const visibleFields = this.getVisibleFields()

    if (!visibleFields.length) {
      return (
        <NoData
          description={localize(Localization.NOTHING_TO_DISPLAY)}
        />
      )
    }

    return (
      <div>
        {visibleFields.map(this.renderField)}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  activeFieldPk: uiSelector(state)[UiKeys.ACTIVE_FIELD_PK],
  activeFieldTypes: activeFieldTypesSelector(state),
  document: documentSelector(state),
  documentType: documentTypeSelector(state),
  fetching: isDocumentDataFetchingSelector(state),
})

const ConnectedComponent = connect(mapStateToProps)(DocumentFields)

export {
  ConnectedComponent as DocumentFields,
}
