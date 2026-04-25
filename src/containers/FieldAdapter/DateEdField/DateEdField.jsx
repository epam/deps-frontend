
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { DatePicker } from '@/components/DatePicker'
import { CalendarIcon } from '@/components/Icons/CalendarIcon'
import { CONFIDENCE_BREAKPOINT } from '@/constants/confidence'
import { CoordsHighlightTrigger } from '@/containers/CoordsHighlightTrigger'
import {
  FieldLabel,
  InfoWrapper,
  ContentWrapper,
  FieldWrapper,
  PrimitiveFieldContent,
  FieldInputWrapper,
} from '@/containers/DocumentField'
import { FieldValidationResult } from '@/containers/FieldAdapter/FieldValidationResult'
import { InView } from '@/containers/InView'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { FieldValidation, fieldValidationShape } from '@/models/DocumentValidation'
import { ExtractedDataField, extractedDataFieldShape } from '@/models/ExtractedData'
import {
  dayjsToString,
  stringToDayjs,
  toLocalizedDateString,
} from '@/utils/dayjs'
import { ENV } from '@/utils/env'
import { Flags } from '../Flags'
import { PrimitiveEdFieldActionsMenu } from '../PrimitiveEdFieldActionsMenu'
import { useFieldProps } from '../useFieldProps'
import { StyledTextAreaField } from './DateEdField.styles'

const dateNow = dayjs()

export const DateEdField = ({
  disabled,
  dtField,
  edField,
  id,
  renderActions,
  validation,
  renderLabel,
}) => {
  const {
    onChangeData,
    onFocus,
    setHighlightedField,
    highlightArea,
    getValueToDisplay,
  } = useFieldProps(dtField, edField)

  const confidence = useMemo(
    () => ExtractedDataField.getConfidencePercent(edField),
    [edField],
  )

  const shouldHideConfidenceFlag = useMemo(() => (
    ENV.FEATURE_HIDE_LOW_CONFIDENCE_DUE_TO_VALIDATION_ERRORS &&
    FieldValidation.getAllErrors(validation).length &&
    confidence < CONFIDENCE_BREAKPOINT.LOW
  ), [validation, confidence])

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
  [
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

  const getPopupContainer = (trigger) => trigger.parentNode.parentNode

  const onDatePickerValueChange = (value) => {
    const localizedDateStr = toLocalizedDateString(dayjsToString(value))
    onChangeData(localizedDateStr)
  }

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
        {
          Label && (
            <InfoWrapper>
              {Label}
            </InfoWrapper>
          )
        }
        <ContentWrapper>
          <PrimitiveFieldContent>
            {renderFlags()}
            <FieldInputWrapper
              disabled={disabled}
              hasErrors={!!FieldValidation.getAllErrors(validation).length}
              hasWarnings={!!FieldValidation.getAllWarnings(validation).length}
            >
              <StyledTextAreaField
                disabled={disabled}
                onChange={onChangeData}
                onFocus={onFocus}
                value={getValueToDisplay(dtField.fieldMeta?.displayCharLimit)}
              />
              <DatePicker
                allowClear={false}
                disabled={disabled}
                getPopupContainer={getPopupContainer}
                onChange={onDatePickerValueChange}
                onFocus={onFocus}
                suffixIcon={<CalendarIcon />}
                value={
                  stringToDayjs(edField.data.value) ||
                  dateNow
                }
              />
              {
                !shouldHideConfidenceFlag && (
                  <Flags
                    confidence={confidence}
                  />
                )
              }
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

DateEdField.propTypes = {
  disabled: PropTypes.bool.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  edField: extractedDataFieldShape.isRequired,
  id: PropTypes.string,
  renderActions: PropTypes.func,
  validation: fieldValidationShape,
  renderLabel: PropTypes.func,
}
