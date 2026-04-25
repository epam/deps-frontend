
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { stringsToOptions } from '@/components/Select'
import { CONFIDENCE_BREAKPOINT } from '@/constants/confidence'
import { CoordsHighlightTrigger } from '@/containers/CoordsHighlightTrigger'
import {
  FieldLabel,
  ContentWrapper,
  InfoWrapper,
  FieldWrapper,
  PrimitiveFieldContent,
  TextAreaIconsWrapper as IconsWrapper,
  TextAreaField,
} from '@/containers/DocumentField'
import { FieldValidationResult } from '@/containers/FieldAdapter/FieldValidationResult'
import { PromptPreviewButton } from '@/containers/FieldAdapter/PromptPreviewButton'
import { InView } from '@/containers/InView'
import { useExpandableText } from '@/hooks/useExpandableText'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { FieldValidation, fieldValidationShape } from '@/models/DocumentValidation'
import { ExtractedDataField, extractedDataFieldShape } from '@/models/ExtractedData'
import { llmExtractionQueryNodeShape } from '@/models/LLMExtractor'
import { ENV } from '@/utils/env'
import { Flags } from '../Flags'
import { PrimitiveEdFieldActionsMenu } from '../PrimitiveEdFieldActionsMenu'
import { useFieldProps } from '../useFieldProps'
import { FieldInputWrapper } from './StringEdField.styles'

const StringEdField = ({
  disabled,
  dtField,
  edField,
  id,
  renderActions,
  validation,
  renderLabel,
  promptChain,
}) => {
  const {
    onChangeData,
    onFocus,
    setHighlightedField,
    highlightArea,
    getValueToDisplay,
  } = useFieldProps(dtField, edField)

  const {
    ExpandableContainer,
    ToggleExpandIcon,
  } = useExpandableText()

  const confidence = useMemo(() => ExtractedDataField.getConfidencePercent(edField), [edField])

  const regularFieldProps = useMemo(() => ({
    fieldType: dtField.fieldType,
    code: dtField.code,
    value: getValueToDisplay(dtField.fieldMeta?.displayCharLimit),
    options: dtField.fieldMeta?.options ? stringsToOptions(dtField.fieldMeta.options) : [],
    onChange: onChangeData,
    onFocus,
    disabled,
    placeholder: '',
  }), [
    disabled,
    dtField.code,
    dtField.fieldMeta?.options,
    dtField.fieldMeta?.displayCharLimit,
    dtField.fieldType,
    getValueToDisplay,
    onChangeData,
    onFocus,
  ])

  const FieldActionsMenu = useMemo(() => (
    !renderActions
      ? (
        <PrimitiveEdFieldActionsMenu
          disabled={disabled}
          dtField={dtField}
          edField={edField}
        />
      )
      : renderActions()
  ),
  [renderActions, disabled, dtField, edField])

  const shouldHideConfidenceFlag = useMemo(() => (
    ENV.FEATURE_HIDE_LOW_CONFIDENCE_DUE_TO_VALIDATION_ERRORS &&
    FieldValidation.getAllErrors(validation).length &&
    confidence < CONFIDENCE_BREAKPOINT.LOW
  ), [validation, confidence])

  const Label = useMemo(() => {
    if (renderLabel) {
      return renderLabel(dtField)
    }

    return (
      <FieldLabel
        name={dtField.name}
        required={dtField.required}
      />
    )
  }, [
    dtField,
    renderLabel,
  ])

  const renderFlags = useCallback(() =>
    (edField?.comments || edField?.data.modifiedBy) && (
      <Flags
        comments={edField.comments}
        modifiedBy={edField?.data.modifiedBy}
      />
    ), [edField])

  return (
    <FieldWrapper>
      <InView id={id}>
        <InfoWrapper>
          {Label}
          <PromptPreviewButton promptChain={promptChain} />
        </InfoWrapper>
        <ContentWrapper>
          <PrimitiveFieldContent>
            {renderFlags()}
            <FieldInputWrapper
              disabled={disabled}
              hasErrors={!!FieldValidation.getAllErrors(validation).length}
              hasWarnings={!!FieldValidation.getAllWarnings(validation).length}
            >
              <ExpandableContainer>
                <TextAreaField {...regularFieldProps} />
              </ExpandableContainer>
              <IconsWrapper>
                {
                  !shouldHideConfidenceFlag && (
                    <Flags
                      confidence={confidence}
                    />
                  )
                }
                <ToggleExpandIcon />
              </IconsWrapper>
            </FieldInputWrapper>
            <CoordsHighlightTrigger
              edField={edField}
              highlightArea={highlightArea}
              setHighlightedField={setHighlightedField}
            />
          </PrimitiveFieldContent>
          {FieldActionsMenu}
        </ContentWrapper>
        {
          FieldValidation.hasIssues(validation) && (
            <FieldValidationResult
              validation={validation}
            />
          )
        }
      </InView>
    </FieldWrapper>
  )
}

StringEdField.propTypes = {
  disabled: PropTypes.bool.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  edField: extractedDataFieldShape.isRequired,
  id: PropTypes.string,
  renderActions: PropTypes.func,
  validation: fieldValidationShape,
  renderLabel: PropTypes.func,
  promptChain: PropTypes.arrayOf(llmExtractionQueryNodeShape),
}

export {
  StringEdField,
}
