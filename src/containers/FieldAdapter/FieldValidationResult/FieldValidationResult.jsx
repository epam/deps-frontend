
import { useState } from 'react'
import { AngleDownIcon } from '@/components/Icons/AngleDownIcon'
import { AngleUpIcon } from '@/components/Icons/AngleUpIcon'
import { Localization, localize } from '@/localization/i18n'
import {
  FieldValidation,
  FieldValidationSeverity,
  fieldValidationShape,
} from '@/models/DocumentValidation'
import { FieldValidationMessage } from '../FieldValidationMessage'
import {
  ItemWrapper,
  ItemIndex,
  ErrorIcon,
  WarningIcon,
  ButtonContent,
  Button,
  Wrapper,
} from './FieldValidationResult.styles'

const MAX_ITEMS_NUMBER = 5

const VALIDATION_SEVERITY_TO_ICON_RENDER = {
  [FieldValidationSeverity.ERROR]: <ErrorIcon />,
  [FieldValidationSeverity.WARNING]: <WarningIcon />,
}

const FieldValidationResult = ({
  validation,
}) => {
  const [showAll, setShowAll] = useState(false)

  const validationResults = [
    ...FieldValidation.getAllErrors(validation),
    ...FieldValidation.getAllWarnings(validation),
  ]

  const itemsToDisplay = showAll ? validationResults : validationResults.slice(0, MAX_ITEMS_NUMBER)

  const toggleShowAll = () => {
    setShowAll((prev) => !prev)
  }

  const getButtonContent = () => {
    if (showAll) {
      return (
        <ButtonContent>
          {localize(Localization.COLLAPSE)}
          <AngleUpIcon />
        </ButtonContent>
      )
    }

    return (
      <ButtonContent>
        {localize(Localization.SHOW_ALL, { count: validationResults.length })}
        <AngleDownIcon />
      </ButtonContent>
    )
  }

  const showMessageIndex = itemsToDisplay.length > 1

  return (
    <Wrapper>
      <ul>
        {
          itemsToDisplay.map((item, index) => (
            <ItemWrapper key={index}>
              {
                showMessageIndex && (
                  <ItemIndex>
                    {index + 1}
                    .
                  </ItemIndex>
                )
              }
              {VALIDATION_SEVERITY_TO_ICON_RENDER[item.severity]}
              <FieldValidationMessage validationItem={item} />
            </ItemWrapper>
          ))
        }
      </ul>
      {
        validationResults.length > MAX_ITEMS_NUMBER && (
          <Button onClick={toggleShowAll}>
            {getButtonContent()}
          </Button>
        )
      }
    </Wrapper>
  )
}

FieldValidationResult.propTypes = {
  validation: fieldValidationShape.isRequired,
}

export {
  FieldValidationResult,
}
