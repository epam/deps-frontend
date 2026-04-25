
import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import { OutputProfileFeatureSwitch } from '@/containers/OutputProfileFeatureSwitch'
import { DOCUMENT_LAYOUT_FEATURE } from '@/enums/DocumentLayoutType'
import { Localization, localize } from '@/localization/i18n'
import { ParsingFeature } from '@/models/ParsingFeature'
import {
  Wrapper,
  Label,
  FeaturesWrapper,
} from './LayoutFeatures.styles'

const parsingFeatures = [
  new ParsingFeature(DOCUMENT_LAYOUT_FEATURE.KEY_VALUE_PAIRS, localize(Localization.KEY_VALUE_PAIRS)),
  new ParsingFeature(DOCUMENT_LAYOUT_FEATURE.TABLES, localize(Localization.TABLES)),
  new ParsingFeature(DOCUMENT_LAYOUT_FEATURE.TEXT, localize(Localization.TEXT)),
]

const LayoutFeatures = ({
  features,
  updateProfile,
}) => {
  const onChange = useCallback((checked, code) => {
    const newFeatures = checked ? [...features, code] : features.filter((item) => item !== code)

    updateProfile((profile) => {
      const { schema } = profile
      return {
        ...profile,
        schema: {
          ...schema,
          features: newFeatures,
        },
      }
    })
  }, [
    features,
    updateProfile,
  ])

  const Features = useMemo(() =>
    parsingFeatures.map(({ code, name }) => (
      <OutputProfileFeatureSwitch
        key={code}
        checked={features.includes(code)}
        code={code}
        name={name}
        onChange={onChange}
      />
    )), [
    features,
    onChange,
  ])

  return (
    <Wrapper>
      <Label>
        {localize(Localization.LAYOUTS)}
      </Label>
      <FeaturesWrapper>
        {Features}
      </FeaturesWrapper>
    </Wrapper>
  )
}

LayoutFeatures.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(DOCUMENT_LAYOUT_FEATURE)),
  ).isRequired,
  updateProfile: PropTypes.func.isRequired,
}

export {
  LayoutFeatures,
}
