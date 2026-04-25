
import PropTypes from 'prop-types'
import { StatisticCard } from '@/components/StatisticCard'
import { Localization, localize } from '@/localization/i18n'
import {
  CardWrapper,
  LimitValueWrapper,
  Hint,
} from './TrialLimitationCard.styles'

const TrialLimitationName = {
  TEMPLATES_PAGE_LIMIT: 'pagesPerTemplate',
  ALL_TEMPLATES: 'allTemplates',
  ALL_FIELDS: 'allFields',
  DOCS_VIA_TEMPLATES: 'documentsViaTemplates',
  DOCS_PER_TEMPLATE: 'documentsPerTemplate',
  DOCS_PER_PLUGIN: 'documentsPerPlugin',
}

const LimitationNameToLocalizedString = {
  [TrialLimitationName.ALL_TEMPLATES]: localize(Localization.TEMPLATES_PER_ORGANIZATION),
  [TrialLimitationName.DOCS_VIA_TEMPLATES]: localize(Localization.DOCS_VIA_TEMPLATES),
  [TrialLimitationName.DOCS_PER_TEMPLATE]: localize(Localization.DOCS_PER_TEMPLATE),
  [TrialLimitationName.DOCS_PER_PLUGIN]: localize(Localization.DOCS_PER_PLUGIN),
  [TrialLimitationName.TEMPLATES_PAGE_LIMIT]: localize(Localization.PAGE_PER_TEMPLATE),
  [TrialLimitationName.ALL_FIELDS]: localize(Localization.ALL_FIELDS),
}

const TrialLimitationCard = ({
  name,
  currentValue,
  limitValue,
}) => {
  if (currentValue !== 0 && !currentValue) {
    return (
      <CardWrapper>
        {limitValue}
        <LimitValueWrapper>
          {LimitationNameToLocalizedString[name].toLowerCase()}
        </LimitValueWrapper>
      </CardWrapper>
    )
  }

  const renderHint = () => currentValue === limitValue && (
    <Hint>
      {localize(Localization.LIMIT_EXCEEDED).toLowerCase()}
    </Hint>
  )

  return (
    <StatisticCard
      currentValue={currentValue}
      renderExtra={renderHint}
      title={LimitationNameToLocalizedString[name].toUpperCase()}
      totalValue={limitValue}
    />
  )
}

TrialLimitationCard.propTypes = {
  name: PropTypes.string.isRequired,
  currentValue: PropTypes.number,
  limitValue: PropTypes.number.isRequired,
}

export {
  TrialLimitationCard,
}
