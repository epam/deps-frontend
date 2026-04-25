
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { Button } from '@/components/Button'
import { ArrowLeftIcon } from '@/components/Icons/ArrowLeftIcon'
import { Tooltip } from '@/components/Tooltip'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'

const BackToSourceButton = ({ sourcePath }) => {
  const dispatch = useDispatch()

  const goToSourcePage = useCallback(() => {
    dispatch(goTo(sourcePath))
  }, [dispatch, sourcePath])

  return (
    <Tooltip
      placement={Placement.TOP_RIGHT}
      title={localize(Localization.GO_TO_BACK)}
    >
      <Button.Secondary
        icon={<ArrowLeftIcon />}
        onClick={goToSourcePage}
      />
    </Tooltip>
  )
}

BackToSourceButton.propTypes = {
  sourcePath: PropTypes.string.isRequired,
}

export {
  BackToSourceButton,
}
