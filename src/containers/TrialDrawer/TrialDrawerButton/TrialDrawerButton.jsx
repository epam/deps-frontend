
import dayjs from 'dayjs'
import {
  useState,
  useCallback,
  useEffect,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrialLimitationsInfo } from '@/actions/trial'
import { Spin } from '@/components/Spin'
import { localize, Localization } from '@/localization/i18n'
import { isTrialLimitationsInfoFetchingSelector } from '@/selectors/requests'
import { trialExpirationDateSelector } from '@/selectors/trial'
import { getDatesDifference, Period } from '@/utils/dayjs'
import { TrialDrawer } from '../TrialDrawer'
import {
  DrawerOpenButton,
  DetailsText,
  DaysLeftText,
} from './TrialDrawerButton.styles'

const getRemainingDays = (date) => {
  const daysDifference = getDatesDifference(
    dayjs.utc(date),
    dayjs(),
    Period.DAY,
  )

  const secondsDifference = getDatesDifference(
    dayjs.utc(date),
    dayjs(),
    Period.SECOND,
  )

  if (secondsDifference <= 0 || !date) {
    return localize(Localization.HAS_EXPIRED).toLowerCase()
  }

  return localize(Localization.TIME_LEFT, { time: daysDifference + 1 })
}

const TrialDrawerButton = () => {
  const [visible, setVisible] = useState(false)

  const expirationDate = useSelector(trialExpirationDateSelector)
  const areLimitationsLoading = useSelector(isTrialLimitationsInfoFetchingSelector)

  const dispatch = useDispatch()

  const openDrawer = () => {
    setVisible(true)
  }

  const closeDrawer = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    dispatch(fetchTrialLimitationsInfo())
  }, [dispatch])

  return (
    <>
      <Spin
        spinning={!expirationDate && areLimitationsLoading}
      >
        <DrawerOpenButton
          onClick={openDrawer}
        >
          {localize(Localization.TRIAL)}
          <DaysLeftText>
            {getRemainingDays(expirationDate)}
          </DaysLeftText>
          <DetailsText>
            {localize(Localization.DETAILS_TEXT)}
          </DetailsText>
        </DrawerOpenButton>
      </Spin>
      <TrialDrawer
        closeDrawer={closeDrawer}
        visible={visible}
      />
    </>
  )
}

export {
  TrialDrawerButton,
}
