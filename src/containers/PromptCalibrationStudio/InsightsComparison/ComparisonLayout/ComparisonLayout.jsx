
import PropTypes from 'prop-types'
import { ArrowRightOutlined } from '@/components/Icons/ArrowRightOutlined'
import { Tooltip } from '@/components/Tooltip'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { Localization, localize } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import {
  Wrapper,
  PseudoInputsWrapper,
  HintWrapper,
  HintContent,
  HintContentNew,
  FieldWrapper,
  ExclamationCircleIcon,
} from './ComparisonLayout.styles'

const GREY_BORDER_PROP = { borderColor: theme.color.grayscale11 }

const SUCCESS_BORDER_PROP = { borderColor: theme.color.success }

export const ComparisonLayout = ({
  hasExecutedValue,
  renderOldValue,
  renderNewValue,
}) => {
  const { activeField } = useFieldCalibration()

  if (!hasExecutedValue) {
    return (
      <Wrapper>
        {renderOldValue(GREY_BORDER_PROP)}
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <HintWrapper>
        <HintContent>
          {localize(Localization.OLD)}
        </HintContent>
        <ArrowRightOutlined />
        <HintContentNew>
          {localize(Localization.NEW)}
        </HintContentNew>
        {
          activeField?.query?.reasoning && (
            <Tooltip title={activeField.query.reasoning}>
              <ExclamationCircleIcon />
            </Tooltip>
          )
        }
      </HintWrapper>
      <PseudoInputsWrapper>
        <FieldWrapper>
          {renderOldValue(GREY_BORDER_PROP)}
        </FieldWrapper>
        <FieldWrapper>
          {renderNewValue(SUCCESS_BORDER_PROP)}
        </FieldWrapper>
      </PseudoInputsWrapper>
    </Wrapper>
  )
}

ComparisonLayout.propTypes = {
  hasExecutedValue: PropTypes.bool.isRequired,
  renderOldValue: PropTypes.func.isRequired,
  renderNewValue: PropTypes.func.isRequired,
}
