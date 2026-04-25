
import PropTypes from 'prop-types'
import { Button } from '@/components/Button'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'

const OpenLabelingToolButton = ({ children, disabled, documentId }) => {
  const onClick = () => {
    goTo(navigationMap.labelingTool.document(documentId))
  }

  return (
    <Button.Text
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button.Text>
  )
}

OpenLabelingToolButton.propTypes = {
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  documentId: PropTypes.string.isRequired,
}

export {
  OpenLabelingToolButton,
}
