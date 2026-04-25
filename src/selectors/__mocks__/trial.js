
import { mockSelector } from '@/mocks/mockSelector'

const mockLimitations = {
  limitation: {
    currentValue: 1,
    limitValue: 20,
  },
}
const trialLimitationsSelector = mockSelector(mockLimitations)
const trialExpirationDateSelector = mockSelector('2023-10-02T09:34:24.249Z')

export {
  trialLimitationsSelector,
  trialExpirationDateSelector,
}
