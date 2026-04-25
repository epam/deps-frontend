
const isFeatureEnabled = (featureName) => FEATURES && FEATURES.indexOf(featureName) !== -1

export {
  isFeatureEnabled,
}
