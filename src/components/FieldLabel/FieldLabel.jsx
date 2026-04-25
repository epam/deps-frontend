
import PropTypes from 'prop-types'
import { isValidElement } from 'react'
import { LongText } from '@/components/LongText'
import { Tooltip } from '@/components/Tooltip'
import { localize, Localization } from '@/localization/i18n'
import { Wrapper, Label, RequiredLabel } from './FieldLabel.styles'

const renderLabelContent = (name) => (
  isValidElement(name) ? name : <LongText text={name} />
)

const renderRequiredLabel = (name, onClick) => (
  <Tooltip
    placement="left"
    title={localize(Localization.REQUIRED_FIELD)}
  >
    <Wrapper onClick={onClick}>
      <RequiredLabel>*</RequiredLabel>
      {renderLabelContent(name)}
    </Wrapper>
  </Tooltip>
)

const FieldLabel = ({
  active,
  clickable,
  onClick,
  name,
  required,
  className,
}) => (
  <Label
    $active={active}
    $clickable={clickable}
    className={className}
  >
    {
      required ? renderRequiredLabel(name, onClick) : (
        <span onClick={onClick}>
          {renderLabelContent(name)}
        </span>
      )
    }
  </Label>
)

FieldLabel.propTypes = {
  active: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  required: PropTypes.bool,
  className: PropTypes.string,
}

export {
  FieldLabel,
}
