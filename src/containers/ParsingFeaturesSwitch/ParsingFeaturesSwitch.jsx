
import PropTypes from 'prop-types'
import { Switch } from '@/components/Switch'
import { ComponentSize } from '@/enums/ComponentSize'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { Localization, localize } from '@/localization/i18n'
import { ParsingFeature } from '@/models/ParsingFeature'
import { FeatureItem, ParsingFeaturesContainer } from './ParsingFeaturesSwitch.styles'

const ParsingFeatures = [
  new ParsingFeature(KnownParsingFeature.TEXT, localize(Localization.TEXT)),
  new ParsingFeature(KnownParsingFeature.IMAGES, localize(Localization.IMAGES)),
  new ParsingFeature(KnownParsingFeature.KEY_VALUE_PAIRS, localize(Localization.KEY_VALUE_PAIRS)),
  new ParsingFeature(KnownParsingFeature.TABLES, localize(Localization.TABLES)),
]

export const ParsingFeaturesSwitch = ({
  onChange,
  value: selectedFeatures,
}) => {
  const handleToggle = (feature) => {
    const isSelected = selectedFeatures.includes(feature)
    const updatedFeatures = isSelected
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature]

    onChange(updatedFeatures)
  }

  return (
    <ParsingFeaturesContainer>
      {
        ParsingFeatures.map((option) => (
          <FeatureItem
            key={option.code}
            onClick={() => handleToggle(option.code)}
          >
            {option.name}
            <Switch
              checked={selectedFeatures.includes(option.code)}
              onChange={() => handleToggle(option.code)}
              size={ComponentSize.SMALL}
            />
          </FeatureItem>
        ))
      }
    </ParsingFeaturesContainer>
  )
}

ParsingFeaturesSwitch.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(KnownParsingFeature)),
  ).isRequired,
}
