
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrialLimitationsInfo } from '@/actions/trial'
import { TRIAL_NOTIFICATION_LAST_SHOWN_DATE } from '@/constants/storage'
import { TrialDrawer } from '@/containers/TrialDrawer'
import { trialExpirationDateSelector } from '@/selectors/trial'
import {
  Period,
  getDatesDifference,
  getStartOfDay,
} from '@/utils/dayjs'
import { localStorageWrapper } from '@/utils/localStorageWrapper'

const TRIAL_INFO_PERIOD = 5

const shouldShowTrialDrawer = (expirationDate) => {
  const now = dayjs()
  const trialEndDate = dayjs(expirationDate)
  const lastShownDate = localStorageWrapper.getItem(TRIAL_NOTIFICATION_LAST_SHOWN_DATE)

  const isShownToday = lastShownDate && getStartOfDay(dayjs(lastShownDate)) === getStartOfDay(now)
  const daysTillEndOfTrial = getDatesDifference(now, trialEndDate, Period.DAY)

  return (
    daysTillEndOfTrial < TRIAL_INFO_PERIOD &&
    daysTillEndOfTrial >= 0 &&
    !isShownToday
  )
}

const TrialNotifier = () => {
  const [visible, setVisible] = useState(false)

  const expirationDate = useSelector(trialExpirationDateSelector)

  const dispatch = useDispatch()

  const closeDrawer = () => {
    setVisible(false)
  }

  useEffect(() => {
    dispatch(fetchTrialLimitationsInfo)
  }, [dispatch])

  useEffect(() => {
    if (
      expirationDate &&
      shouldShowTrialDrawer(expirationDate)
    ) {
      localStorageWrapper.setItem(
        TRIAL_NOTIFICATION_LAST_SHOWN_DATE,
        dayjs(),
      )

      setVisible(true)
    }
  }, [expirationDate])

  return (
    <TrialDrawer
      closeDrawer={closeDrawer}
      visible={visible}
    />
  )
}

export { TrialNotifier }
