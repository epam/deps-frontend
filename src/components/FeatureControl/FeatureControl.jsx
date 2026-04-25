
import { isFeatureEnabled } from '@/utils/features'

function FeatureControl ({ featureName, children }) {
  return isFeatureEnabled(featureName) ? children : null
}

export {
  FeatureControl,
}
