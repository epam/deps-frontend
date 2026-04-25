
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { CoordsHighlightTrigger } from '@/containers/CoordsHighlightTrigger'
import {
  ContentWrapper,
  FieldLabel,
  FieldWrapper,
  InfoWrapper,
  TextAreaField,
  TextAreaIconsWrapper as IconsWrapper,
} from '@/containers/DocumentField'
import { FieldValidationResult } from '@/containers/FieldAdapter/FieldValidationResult'
import { PromptPreviewButton } from '@/containers/FieldAdapter/PromptPreviewButton'
import { InView } from '@/containers/InView'
import { useExpandableText } from '@/hooks/useExpandableText'
import { DocumentTypeField, documentTypeFieldShape } from '@/models/DocumentTypeField'
import {
  documentValidationShape,
  FieldValidation,
  KvId,
} from '@/models/DocumentValidation'
import { ExtractedDataField, extractedDataFieldShape } from '@/models/ExtractedData'
import { llmExtractionQueryNodeShape } from '@/models/LLMExtractor'
import { ENV } from '@/utils/env'
import { Flags } from '../Flags'
import { useFieldProps } from '../useFieldProps'
import { Element, FieldInputWrapper, InfoWrapperCell } from './KeyValuePairEdField.styles'
import { KeyValuePairEdFieldActionsMenu } from './KeyValuePairEdFieldActionsMenu'

const KeyValuePairEdField = ({
  disabled,
  dtField,
  edField,
  id,
  validation,
  renderActions,
  renderLabel,
  promptChain,
}) => {
  const [keyFieldConfig, valueFieldConfig] = useMemo(() => DocumentTypeField.mapDictFieldToDocumentTypeFieldItems(dtField), [dtField])

  const {
    ExpandableContainer: KeyExpandableContainer,
    ToggleExpandIcon: KeyToggleExpandIcon,
  } = useExpandableText()

  const {
    ExpandableContainer: ValueExpandableContainer,
    ToggleExpandIcon: ValueToggleExpandIcon,
  } = useExpandableText()

  const keyEdField = useMemo(() => new ExtractedDataField(
    dtField.pk,
    edField.data.key,
  ), [dtField.pk, edField.data.key])

  const valueEdField = useMemo(() => new ExtractedDataField(
    dtField.pk,
    edField.data.value,
  ), [dtField.pk, edField.data.value])

  const {
    highlightArea: highlightKeyFieldCoords,
    onChangeData: onKeyChange,
    onFocus: onKeyFocus,
    setHighlightedField: setHighlightedKeyField,
  } = useFieldProps(keyFieldConfig, keyEdField)
  const {
    highlightArea: highlightValueFieldCoords,
    onChangeData: onValueChange,
    onFocus: onValueFocus,
    setHighlightedField: setHighlightedValueField,
    getValueToDisplay,
  } = useFieldProps(valueFieldConfig, valueEdField)

  const keyConfidence = useMemo(() => ExtractedDataField.getConfidencePercent(keyEdField), [keyEdField])

  const valueConfidence = useMemo(() => ExtractedDataField.getConfidencePercent(valueEdField), [valueEdField])

  const comments = useMemo(() => {
    if (!edField?.comments?.length) {
      return null
    }
    return Object.values(edField).reduce((a, c) => [...a, ...c.comments], [])
  }, [edField])

  const getFieldValidation = useCallback((fieldId) => {
    if (!validation) {
      return null
    }

    const errors = FieldValidation.getAllErrors(validation).filter((e) => e.kvId === fieldId)
    const warnings = FieldValidation.getAllWarnings(validation).filter((w) => w.kvId === fieldId)

    if (!errors?.length && !warnings?.length) {
      return null
    }

    return {
      errors,
      warnings,
    }
  }, [validation])

  const keyValidationMessages = getFieldValidation(KvId.KEY)
  const valueValidationMessages = getFieldValidation(KvId.VALUE)

  const FieldActionsMenu = useMemo(() => (
    !renderActions
      ? (
        <KeyValuePairEdFieldActionsMenu
          disabled={disabled}
          dtField={dtField}
          edField={edField}
        />
      )
      : renderActions()
  ), [
    renderActions,
    disabled,
    dtField,
    edField,
  ])

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

  const validationResult = useMemo(() => (
    validation && Object.entries(validation).reduce((acc, [type, issues]) => {
      acc[type] = issues
      return acc
    }, {})
  ), [validation])

  const hasInfoContent = useMemo(() => {
    const hasFlags = comments || edField?.data?.key?.modifiedBy || edField?.data?.value?.modifiedBy
    return Label || hasFlags || (promptChain && ENV.FEATURE_LLM_EXTRACTORS)
  }, [
    Label,
    comments,
    edField?.data?.key?.modifiedBy,
    edField?.data?.value?.modifiedBy,
    promptChain,
  ])

  return (
    <FieldWrapper>
      <InView id={id}>
        {
          hasInfoContent && (
            <InfoWrapper>
              {Label}
              <InfoWrapperCell>
                <Flags
                  comments={comments}
                  modifiedBy={edField?.data?.key?.modifiedBy || edField?.data?.value?.modifiedBy}
                />
                <PromptPreviewButton promptChain={promptChain} />
              </InfoWrapperCell>
            </InfoWrapper>
          )
        }
        <ContentWrapper>
          <Element>
            <FieldInputWrapper
              disabled={disabled}
              hasErrors={!!keyValidationMessages?.errors?.length}
              hasWarnings={!!keyValidationMessages?.warnings?.length}
            >
              <KeyExpandableContainer>
                <TextAreaField
                  disabled={disabled}
                  id={id}
                  onChange={onKeyChange}
                  onFocus={onKeyFocus}
                  value={keyEdField.data?.value}
                />
              </KeyExpandableContainer>
              <IconsWrapper>
                <Flags
                  confidence={keyConfidence}
                />
                <KeyToggleExpandIcon />
              </IconsWrapper>
            </FieldInputWrapper>
            <CoordsHighlightTrigger
              edField={keyEdField}
              highlightArea={highlightKeyFieldCoords}
              setHighlightedField={setHighlightedKeyField}
            />
          </Element>
          <Element>
            <FieldInputWrapper
              disabled={disabled}
              hasErrors={!!valueValidationMessages?.errors?.length}
              hasWarnings={!!valueValidationMessages?.warnings?.length}
            >
              <ValueExpandableContainer>
                <TextAreaField
                  disabled={disabled}
                  onChange={onValueChange}
                  onFocus={onValueFocus}
                  value={getValueToDisplay(dtField.fieldMeta?.valueMeta?.displayCharLimit)}
                />
              </ValueExpandableContainer>
              <IconsWrapper>
                <Flags
                  confidence={valueConfidence}
                />
                <ValueToggleExpandIcon />
              </IconsWrapper>
            </FieldInputWrapper>
            <CoordsHighlightTrigger
              edField={valueEdField}
              highlightArea={highlightValueFieldCoords}
              setHighlightedField={setHighlightedValueField}
            />
          </Element>
          {FieldActionsMenu}
        </ContentWrapper>
        {
          FieldValidation.hasIssues(validation) && (
            <FieldValidationResult
              validation={validationResult}
            />
          )
        }
      </InView>
    </FieldWrapper>
  )
}

KeyValuePairEdField.propTypes = {
  disabled: PropTypes.bool.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  edField: extractedDataFieldShape.isRequired,
  id: PropTypes.string,
  validation: documentValidationShape,
  renderActions: PropTypes.func,
  renderLabel: PropTypes.func,
  promptChain: PropTypes.arrayOf(llmExtractionQueryNodeShape),
}

export {
  KeyValuePairEdField,
}
