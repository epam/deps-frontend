
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { localize, Localization } from '@/localization/i18n'
import { childrenShape } from '@/utils/propTypes'
import { LocalBoundary } from './LocalErrorBoundary.styles'

export const LocalErrorBoundary = ({ children }) => {
  const localBoundary = () => (
    <LocalBoundary>
      {localize(Localization.COMMON_ERROR_BOUNDARY_TITLE)}
    </LocalBoundary>
  )

  return (
    <ErrorBoundary
      localBoundary={localBoundary}
    >
      {children}
    </ErrorBoundary>
  )
}

LocalErrorBoundary.propTypes = {
  children: childrenShape.isRequired,
}
