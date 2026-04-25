
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { OutputProfileFeatureSwitch } from '@/containers/OutputProfileFeatureSwitch'
import { DOCUMENT_LAYOUT_FEATURE } from '@/enums/DocumentLayoutType'
import { Localization, localize } from '@/localization/i18n'
import { ParsingFeature } from '@/models/ParsingFeature'
import {
  Wrapper,
  Title,
  FeaturesWrapper,
} from './OutputProfileByLayout.styles'

const parsingFeatures = [
  new ParsingFeature(DOCUMENT_LAYOUT_FEATURE.KEY_VALUE_PAIRS, localize(Localization.KEY_VALUE_PAIRS)),
  new ParsingFeature(DOCUMENT_LAYOUT_FEATURE.TABLES, localize(Localization.TABLES)),
  new ParsingFeature(DOCUMENT_LAYOUT_FEATURE.TEXT, localize(Localization.TEXT)),
]

const OutputProfileByLayout = ({ features }) => {
  const Features = useMemo(() =>
    parsingFeatures.map(({ code, name }) => (
      <OutputProfileFeatureSwitch
        key={code}
        checked={features.includes(code)}
        code={code}
        disabled
        name={name}
      />
    )), [features])

  return (
    <Wrapper>
      <Title>
        {localize(Localization.PARSING_FEATURES)}
      </Title>
      <FeaturesWrapper>
        {Features}
      </FeaturesWrapper>
    </Wrapper>
  )
}

OutputProfileByLayout.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(DOCUMENT_LAYOUT_FEATURE)),
  ).isRequired,
}

export {
  OutputProfileByLayout,
}
