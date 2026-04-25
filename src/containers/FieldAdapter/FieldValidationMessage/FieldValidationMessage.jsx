
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setScrollId } from '@/actions/navigation'
import { getSeparatedId } from '@/containers/InView'
import { validationDescriptionShape } from '@/models/DocumentValidation'
import { documentTypeSelector } from '@/selectors/documentReviewPage'
import { DependentFieldLink, Message } from './FieldValidationMessage.styles'

const FieldValidationMessage = ({
  validationItem,
  className,
  disableTruncate,
}) => {
  const [shouldHideTooltip, setShouldHideTooltip] = useState(false)
  const documentType = useSelector(documentTypeSelector)
  const dispatch = useDispatch()

  const scrollToField = (fieldCode) => {
    const idScrollTo = getSeparatedId(fieldCode)
    setShouldHideTooltip(true)
    dispatch(setScrollId(idScrollTo))
    setTimeout(() => setShouldHideTooltip(false))
  }

  const dtFieldsMap = Object.fromEntries(documentType.fields.map((f) => [f.code, f.name]))

  const renderMessage = (text) => {
    const regex = /\$\{(.*?)\}/g
    const matches = [...text.matchAll(regex)]
    const message = []
    let lastIndex = 0

    if (matches.length === 0) {
      return text
    }

    matches.forEach((match) => {
      const [placeholder, code] = match
      const start = match.index
      const name = dtFieldsMap[code]

      if (start > lastIndex) {
        message.push(text.slice(lastIndex, start))
      }

      message.push(
        name ? (
          <DependentFieldLink
            key={code}
            onClick={() => scrollToField(code)}
          >
            {name}
          </DependentFieldLink>
        ) : (
          placeholder
        ),
      )

      lastIndex = start + placeholder.length
    })

    if (lastIndex < text.length) {
      message.push(text.slice(lastIndex))
    }

    return message
  }

  if (disableTruncate) {
    return renderMessage(validationItem.message)
  }

  return (
    <Message
      className={className}
      shouldHideTooltip={shouldHideTooltip}
      text={renderMessage(validationItem.message)}
    />
  )
}

FieldValidationMessage.propTypes = {
  validationItem: validationDescriptionShape.isRequired,
  disableTruncate: PropTypes.bool,
  className: PropTypes.string,
}

export {
  FieldValidationMessage,
}
