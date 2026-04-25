
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { RadioGroup } from '@/components/Radio'
import { RadioOption } from '@/components/Radio/RadioOption'
import { CoordsHighlightTrigger } from '@/containers/CoordsHighlightTrigger'
import {
  FieldLabel,
  PrimitiveFieldContent,
  FieldWrapper,
  InfoWrapper,
  ContentWrapper,
} from '@/containers/DocumentField'
import { FieldValidationResult } from '@/containers/FieldAdapter/FieldValidationResult'
import { PromptPreviewButton } from '@/containers/FieldAdapter/PromptPreviewButton'
import { InView } from '@/containers/InView'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { FieldValidation, fieldValidationShape } from '@/models/DocumentValidation'
import {
  ExtractedDataField,
  extractedDataFieldShape,
} from '@/models/ExtractedData'
import { llmExtractionQueryNodeShape } from '@/models/LLMExtractor'
import { ENV } from '@/utils/env'
import { Flags } from '../Flags'
import { PrimitiveEdFieldActionsMenu } from '../PrimitiveEdFieldActionsMenu'
import { useFieldProps } from '../useFieldProps'
import { RadioGroupWrapper } from './CheckmarkEdField.styles'

const CheckmarkOption = {
  [localize(Localization.TRUE)]: true,
  [localize(Localization.FALSE)]: false,
}

const CheckmarkEdField = ({
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
  } = useFieldProps(dtField, edField)

  const confidence = useMemo(() => ExtractedDataField.getConfidencePercent(edField), [edField])

  const regularFieldProps = useMemo(() => ({
    fieldType: dtField.fieldType,
    code: dtField.code,
    value: edField.data.value,
    disabled,
    placeholder: '',
  }), [
    disabled,
    dtField.code,
    edField.data.value,
    dtField.fieldType,
  ])

  const onChangeRadio = useCallback(
    (value) => {
      onChangeData(value)
      onFocus()
    },
    [
      onChangeData,
      onFocus],
  )

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

  const options = useMemo(() => Object.entries(CheckmarkOption).map(([text, value]) => new RadioOption({
    value,
    text,
  })), [])

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

  const hasInfoContent = useMemo(() =>
    Label || (promptChain && ENV.FEATURE_LLM_EXTRACTORS),
  [Label, promptChain],
  )

  return (
    <FieldWrapper>
      <InView id={id}>
        {
          hasInfoContent && (
            <InfoWrapper>
              {Label}
              <PromptPreviewButton promptChain={promptChain} />
            </InfoWrapper>
          )
        }
        <ContentWrapper>
          <PrimitiveFieldContent>
            {renderFlags()}
            <RadioGroupWrapper
              disabled={disabled}
              hasErrors={!!FieldValidation.getAllErrors(validation).length}
              hasWarnings={!!FieldValidation.getAllWarnings(validation).length}
            >
              <RadioGroup
                {...regularFieldProps}
                onChange={onChangeRadio}
                options={options}
              />
              <Flags
                confidence={confidence}
              />
            </RadioGroupWrapper>
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

CheckmarkEdField.propTypes = {
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
  CheckmarkEdField,
}
