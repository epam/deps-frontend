
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useCustomization } from '@/hooks/useCustomization'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'

export const useCustomModule = (moduleName) => {
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)

  const url = useMemo(
    () =>
      customization?.[moduleName]?.getUrl(
        user.organisation.customizationUrl || user.defaultCustomizationUrl,
      ),
    [
      customization,
      user.defaultCustomizationUrl,
      user.organisation.customizationUrl,
      moduleName,
    ],
  )

  return useCustomization(url)
}
