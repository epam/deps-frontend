
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { connect } from 'react-redux'
import {
  highlightPolygonCoordsField,
  highlightTableCoordsField,
  highlightTextCoordsField,
} from '@/actions/documentReviewPage'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { UiKeys } from '@/constants/navigation'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { documentShape } from '@/models/Document'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { fieldValidationShape } from '@/models/DocumentValidation'
import {
  extractedDataFieldShape,
} from '@/models/ExtractedData'
import { highlightedFieldShape } from '@/models/HighlightedField'
import { llmExtractionQueryNodeShape } from '@/models/LLMExtractor'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import {
  highlightedFieldSelector,
  documentSelector,
} from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { getSeparatedId } from '../InView'
import { mapFieldTypeToRender } from './FieldTypeToRender'
import { useFieldProps } from './useFieldProps'

const FieldAdapter = ({
  active,
  activePage,
  highlightedField,
  edField,
  customLabel,
  highlightPolygonCoordsField,
  highlightTableCoordsField,
  highlightTextCoordsField,
  disabled,
  dtField,
  validation,
  customization,
  document,
  user,
  promptChain,
}) => {
  const {
    onChangeData,
    setField,
    highlightArea,
    revertValue,
    isRevertDisabled,
  } = useFieldProps(dtField, edField)

  const props = useMemo(() => ({
    1: {
      active,
      activePage,
      highlightedField,
      edField,
      customLabel,
      highlightArea,
      highlightPolygonCoordsField,
      highlightTableCoordsField,
      highlightTextCoordsField,
      disabled,
      dtField,
      validation,
      onChangeData,
      resetValue: revertValue,
      setField,
      isResetDisabled: isRevertDisabled,
      promptChain,
    },
  }), [
    active,
    activePage,
    highlightArea,
    highlightedField,
    edField,
    customLabel,
    highlightPolygonCoordsField,
    highlightTableCoordsField,
    highlightTextCoordsField,
    disabled,
    dtField,
    validation,
    onChangeData,
    revertValue,
    setField,
    isRevertDisabled,
    promptChain,
  ])

  const EdField = mapFieldTypeToRender(dtField.fieldType)

  const renderField = () => (
    <EdField
      active={active}
      disabled={disabled}
      dtField={dtField}
      edField={edField}
      onChangeData={onChangeData}
      promptChain={promptChain}
      validation={validation}
    />
  )

  const getProps = (version) => props[version]
  const fieldId = getSeparatedId(dtField.code)

  return (
    customization.Field
      ? (
        <ErrorBoundary
          key={dtField.code}
          localBoundary={renderField}
        >
          <ModuleLoader
            url={
              customization.Field.getUrl(
                user.organisation.customizationUrl ||
                user.defaultCustomizationUrl,
              )
            }
          >
            {
              (CustomField) => (
                <CustomField {...getProps('1')}>
                  <EdField
                    active={active}
                    disabled={disabled}
                    documentId={document._id}
                    dtField={dtField}
                    edField={edField}
                    id={fieldId}
                    onChangeData={onChangeData}
                    promptChain={promptChain}
                    validation={validation}
                  />
                </CustomField>
              )
            }
          </ModuleLoader>
        </ErrorBoundary>
      ) : (
        <EdField
          active={active}
          disabled={disabled}
          documentId={document._id}
          dtField={dtField}
          edField={edField}
          id={fieldId}
          promptChain={promptChain}
          validation={validation}
        />
      )
  )
}

FieldAdapter.propTypes = {
  active: PropTypes.bool,
  activePage: PropTypes.number,
  highlightedField: highlightedFieldShape,
  customLabel: PropTypes.element,
  disabled: PropTypes.bool.isRequired,
  edField: extractedDataFieldShape.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  validation: fieldValidationShape,
  highlightPolygonCoordsField: PropTypes.func.isRequired,
  highlightTableCoordsField: PropTypes.func.isRequired,
  highlightTextCoordsField: PropTypes.func.isRequired,
  customization: PropTypes.shape({
    Field: PropTypes.shape({
      getUrl: PropTypes.func,
    }),
  }),
  document: documentShape.isRequired,
  user: userShape,
  promptChain: PropTypes.arrayOf(llmExtractionQueryNodeShape),
}

const mapStateToProps = (state) => ({
  activePage: uiSelector(state)[UiKeys.ACTIVE_PAGE],
  highlightedField: highlightedFieldSelector(state),
  customization: customizationSelector(state),
  document: documentSelector(state),
  user: userSelector(state),
})

const mapDispatchToProps = {
  highlightPolygonCoordsField,
  highlightTableCoordsField,
  highlightTextCoordsField,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(FieldAdapter)

export {
  ConnectedComponent as FieldAdapter,
}
