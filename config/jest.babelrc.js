
const config = require('./.babelrc.js')

const mergePresets = (presets, overrides) => {
  return presets.map((preset) => {
    if (!Array.isArray(preset)) {
      return preset
    }

    const [name] = preset
    const override = overrides.find((override) => {
      if (!Array.isArray(override)) {
        return false
      }

      const [overrideName] = override
      return name === overrideName
    })

    return override || preset
  })
}

module.exports = {
  ...config,
  presets: mergePresets(
    config.presets,
    [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ]
    ]
  )
}
