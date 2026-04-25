
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const fetchTrialLimitations = () => apiRequest.get(apiMap.apiGateway.v1.trialInfo())

export {
  fetchTrialLimitations,
}
