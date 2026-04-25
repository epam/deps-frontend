
import { useState, useEffect, useCallback } from 'react'
import { useDynamicScript } from '@/hooks/useDynamicScript'
import { getSharedModule } from '@/utils/moduleFederation'
import { customizationCache } from './customizationCache'

const getScopeName = (url) => url.split('/').pop().split('.')[0]

const getModuleName = (url) => (
  `./${getScopeName(url)}`
)

const useCustomization = (url) => {
  const [module, setModule] = useState(null)
  const [loadFail, setLoadFail] = useState(false)
  const { ready, failed } = useDynamicScript(url)

  const loadSharedModule = useCallback(
    async (scopeName, moduleName) => {
      try {
        const module = await getSharedModule(scopeName, moduleName)
        customizationCache.set(url, module.default)
        setModule(module.default)
      } catch {
        setLoadFail(true)
      }
    },
    [url],
  )

  useEffect(() => {
    if (customizationCache.has(url)) {
      setModule(customizationCache.get(url))
      return
    }

    if (!ready) {
      return
    }

    const scope = getScopeName(url)
    const module = getModuleName(url)
    loadSharedModule(scope, module)
  }, [url, ready, loadSharedModule])

  return {
    ready: !url || !!module,
    failed: loadFail || failed,
    module,
  }
}

export { useCustomization }
