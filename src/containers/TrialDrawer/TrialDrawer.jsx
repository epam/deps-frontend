
import PropTypes from 'prop-types'
import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrialLimitationsInfo } from '@/actions/trial'
import { ButtonType, Button } from '@/components/Button'
import { CircleInfoIcon } from '@/components/Icons/CircleInfoIcon'
import { Spin } from '@/components/Spin'
import { localize, Localization } from '@/localization/i18n'
import { isTrialLimitationsInfoFetchingSelector } from '@/selectors/requests'
import { trialLimitationsSelector } from '@/selectors/trial'
import { theme } from '@/theme/theme.default'
import {
  Drawer,
  Title,
} from './TrialDrawer.styles'
import { TrialLimitationCard } from './TrialLimitationCard'

const TrialDrawer = ({
  closeDrawer,
  visible,
}) => {
  const limitations = useSelector(trialLimitationsSelector)
  const isLimitationsInfoFetching = useSelector(isTrialLimitationsInfoFetchingSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    visible && dispatch(fetchTrialLimitationsInfo())
  }, [visible, dispatch])

  const DrawerTitle = useMemo(() => (
    <Title>
      <CircleInfoIcon />
      {localize(Localization.TRIAL_PERIOD_DETAILS)}
    </Title>
  ), [])

  const DrawerFooter = useMemo(() => (
    <Button
      onClick={closeDrawer}
      type={ButtonType.PRIMARY}
    >
      {localize(Localization.GOT_IT)}
    </Button>
  ), [closeDrawer])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      hasCloseIcon={false}
      onClose={closeDrawer}
      open={visible}
      title={DrawerTitle}
      width={theme.size.drawerWidth}
    >
      <Spin spinning={isLimitationsInfoFetching}>
        {
          limitations && (
            Object.entries(limitations)
              .filter(([, value]) => value.limitValue !== null)
              .map(([name, info]) => (
                <TrialLimitationCard
                  key={name}
                  currentValue={info.currentValue}
                  limitValue={info.limitValue}
                  name={name}
                />
              ))
          )
        }
      </Spin>
    </Drawer>
  )
}

TrialDrawer.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export {
  TrialDrawer,
}
