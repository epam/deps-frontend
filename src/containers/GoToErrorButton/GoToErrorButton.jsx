
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { goToError } from '@/actions/documentReviewPage'
import { Button } from '@/components/Button'
import { UiKeys } from '@/constants/navigation'
import { uiSelector } from '@/selectors/navigation'

const GoToErrorButton = (props) => (
  <Button.Text
    disabled={props.errorsPages.length === 0}
    onClick={props.goToError}
  >
    {props.children}
  </Button.Text>
)

GoToErrorButton.propTypes = {
  children: PropTypes.string.isRequired,
  goToError: PropTypes.func.isRequired,
  errorsPages: PropTypes.arrayOf(PropTypes.string),
}

const mapStateToProps = (state) => ({
  errorsPages: [],
  activePage: uiSelector(state)[UiKeys.ACTIVE_PAGE] || 1,
})

const mergeProps = (stateProps, { dispatch }, ownProps) => ({
  ...stateProps,
  ...ownProps,
  goToError: () => dispatch(goToError(stateProps.errorsPages, stateProps.activePage)),
})

const ConnectedComponent = connect(mapStateToProps, null, mergeProps)(GoToErrorButton)

export {
  ConnectedComponent as GoToErrorButton,
}
