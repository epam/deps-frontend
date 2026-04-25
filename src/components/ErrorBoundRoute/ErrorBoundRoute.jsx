
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const ErrorBoundRoute = ({
  exact,
  children,
  path,
  render,
  localBoundary,
}) => (
  <ErrorBoundary localBoundary={localBoundary}>
    <Route
      exact={exact}
      path={path}
      render={render}
    >
      {children}
    </Route>
  </ErrorBoundary>
)

ErrorBoundRoute.propTypes = {
  children: PropTypes.element,
  exact: PropTypes.bool,
  localBoundary: PropTypes.func,
  path: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  render: PropTypes.func,
}

export { ErrorBoundRoute }
