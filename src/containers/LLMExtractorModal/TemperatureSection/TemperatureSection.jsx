
import {
  FormItem,
  RequiredValidator,
} from '@/components/Form/ReactHookForm'
import { GraduatedSlider } from '@/components/GraduatedSlider'
import { Localization, localize } from '@/localization/i18n'
import { FieldsWrapper } from './TemperatureSection.styles'

const FIELDS_CODE = {
  TEMPERATURE: 'temperature',
  TOP_P: 'topP',
}

const MIN_TEMPERATURE_VALUE = 0
const MAX_TEMPERATURE_VALUE = 2
const TEMPERATURE_VALUE_STEP = 0.1
const DEFAULT_TEMPERATURE_VALUE = 0
const TEMPERATURE_VALUE_PRECISION = 1

const MIN_TOP_P_VALUE = 0
const MAX_TOP_P_VALUE = 1
const TOP_P_VALUE_STEP = 0.05
const DEFAULT_TOP_P_VALUE = 1
const TOP_P_VALUE_PRECISION = 2

const TemperatureSection = () => {
  const temperatureFields = [
    {
      code: FIELDS_CODE.TEMPERATURE,
      defaultValue: DEFAULT_TEMPERATURE_VALUE,
      label: localize(Localization.TEMPERATURE),
      requiredMark: true,
      rules: {
        ...new RequiredValidator(),
      },
      render: (props) => (
        <GraduatedSlider
          {...props}
          dots={true}
          max={MAX_TEMPERATURE_VALUE}
          min={MIN_TEMPERATURE_VALUE}
          precision={TEMPERATURE_VALUE_PRECISION}
          step={TEMPERATURE_VALUE_STEP}
        />
      ),
    },
    {
      code: FIELDS_CODE.TOP_P,
      defaultValue: DEFAULT_TOP_P_VALUE,
      label: localize(Localization.TOP_P),
      requiredMark: true,
      rules: {
        ...new RequiredValidator(),
      },
      render: (props) => (
        <GraduatedSlider
          {...props}
          dots={true}
          max={MAX_TOP_P_VALUE}
          min={MIN_TOP_P_VALUE}
          precision={TOP_P_VALUE_PRECISION}
          step={TOP_P_VALUE_STEP}
        />
      ),
    },
  ]

  return (
    <FieldsWrapper>
      {
        temperatureFields.map(({ label, requiredMark, ...field }) => (
          <FormItem
            key={field.code}
            field={field}
            label={label}
            requiredMark={requiredMark}
          />
        ))
      }
    </FieldsWrapper>
  )
}

export {
  TemperatureSection,
}
