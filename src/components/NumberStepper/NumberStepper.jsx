
import PropTypes from 'prop-types'
import { Button } from '@/components/Button'
import { MinusOutlinedIcon } from '@/components/Icons/MinusOutlinedIcon'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import {
  InputNumber,
  Wrapper,
} from './NumberStepper.styles'

const DEFAULT_STEP = 1

const NumberStepper = ({
  onChange,
  step = DEFAULT_STEP,
  value,
}) => {
  const incrementValue = () => {
    onChange(value + step)
  }

  const decrementValue = () => {
    onChange(value - step)
  }

  return (
    <Wrapper>
      <InputNumber
        controls={false}
        onChange={onChange}
        value={value}
      />
      <Button.Secondary
        icon={<MinusOutlinedIcon />}
        onClick={decrementValue}
      />
      <Button.Secondary
        icon={<PlusIcon />}
        onClick={incrementValue}
      />
    </Wrapper>
  )
}

NumberStepper.propTypes = {
  onChange: PropTypes.func.isRequired,
  step: PropTypes.number,
  value: PropTypes.number.isRequired,
}

export {
  NumberStepper,
}
