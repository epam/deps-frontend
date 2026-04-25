
import PropTypes from 'prop-types'
import { Spin } from '@/components/Spin'
import { useCustomization } from '@/hooks/useCustomization'

const ModuleLoader = ({ url, children }) => {
  const { ready, failed, module } = useCustomization(url)

  if (!ready && !failed) {
    return <Spin spinning />
  }

  if (failed) {
    throw new Error(`Failed to load ${url}`)
  }

  return (
    children
      ? children(module)
      : module
  )
}

ModuleLoader.propTypes = {
  url: PropTypes.string.isRequired,
  children: PropTypes.func,
}

export { ModuleLoader }
