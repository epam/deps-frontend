
import PropTypes from 'prop-types'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Localization, localize } from '@/localization/i18n'
import {
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
} from './InsightsErrorBoundary.styles'

const InsightsFallback = () => (
  <ErrorContainer>
    <ErrorTitle>
      {localize(Localization.INSIGHTS_ERROR_TITLE)}
    </ErrorTitle>
    <ErrorMessage>
      {localize(Localization.INSIGHTS_ERROR_DESCRIPTION)}
    </ErrorMessage>
  </ErrorContainer>
)

export const InsightsErrorBoundary = ({ children, onError }) => (
  <ErrorBoundary
    localBoundary={InsightsFallback}
    onError={onError}
  >
    {children}
  </ErrorBoundary>
)

InsightsErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
}
