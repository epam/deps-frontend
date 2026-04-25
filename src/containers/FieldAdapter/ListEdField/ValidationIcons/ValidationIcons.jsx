
import { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { setScrollId } from '@/actions/navigation'
import { Tooltip } from '@/components/Tooltip'
import { getSeparatedId } from '@/containers/InView'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { FieldValidation, fieldValidationShape } from '@/models/DocumentValidation'
import {
  ErrorIcon,
  ValidationMessageItem,
  ValidationMessagesList,
  WarningIcon,
  ValidationMessage,
} from './ValidationIcons.styles'

const ValidationIcons = ({
  validation,
  dtField,
}) => {
  const dispatch = useDispatch()

  const warnings = FieldValidation.getAllWarnings(validation)
  const errors = FieldValidation.getAllErrors(validation)

  const firstErrorIndex = useMemo(() => (
    errors.length
      ? errors.filter((e) => e.index !== null)
        .sort((a, b) => a.index - b.index)?.[0]?.index
      : null
  ), [errors])

  const firstWarningIndex = useMemo(() => (
    warnings.length
      ? warnings.filter((e) => e.index !== null)
        .sort((a, b) => a.index - b.index)?.[0]?.index
      : null
  ), [warnings])

  const onErrorIconClick = useCallback(() => {
    if (firstErrorIndex === null) {
      return
    }

    const idScrollTo = getSeparatedId(dtField.code, firstErrorIndex)
    dispatch(setScrollId(idScrollTo))
  }, [
    dispatch,
    dtField.code,
    firstErrorIndex,
  ])

  const onWarningIconClick = useCallback(() => {
    if (firstWarningIndex === null) {
      return
    }

    const idScrollTo = getSeparatedId(dtField.code, firstWarningIndex)
    dispatch(setScrollId(idScrollTo))
  }, [
    dispatch,
    dtField.code,
    firstWarningIndex,
  ])

  const getMessageAsList = useCallback((validationItems) => (
    <ValidationMessagesList>
      {
        validationItems.map((item, index) => (
          <ValidationMessageItem key={index}>
            <ValidationMessage
              disableTruncate
              validationItem={item}
            />
          </ValidationMessageItem>
        ),
        )
      }
    </ValidationMessagesList>
  ), [])

  return (
    <>
      {
        !!warnings.length && (
          <Tooltip title={getMessageAsList(warnings)}>
            <WarningIcon onClick={onWarningIconClick} />
          </Tooltip>
        )
      }
      {
        !!errors.length && (
          <Tooltip title={getMessageAsList(errors)}>
            <ErrorIcon onClick={onErrorIconClick} />
          </Tooltip>
        )
      }
    </>
  )
}

ValidationIcons.propTypes = {
  validation: fieldValidationShape.isRequired,
  dtField: documentTypeFieldShape.isRequired,
}

export {
  ValidationIcons,
}
