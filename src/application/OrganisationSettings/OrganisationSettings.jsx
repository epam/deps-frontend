
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCustomization } from '@/actions/customization'
import { OrganisationSettingsFailure } from '@/application/ApplicationError/OrganisationSettingsFailure'
import { Spin } from '@/components/Spin'
import { useCustomization } from '@/hooks/useCustomization'
import { Organisation } from '@/models/Organisation'
import { userSelector } from '@/selectors/authorization'
import { childrenShape } from '@/utils/propTypes'

const OrganisationSettings = ({
  children,
}) => {
  const dispatch = useDispatch()
  const { organisation, defaultCustomizationUrl } = useSelector(userSelector)
  const {
    ready: isCustomizationReady,
    failed: isCustomizationFailed,
    module: initCustomization,
  } = useCustomization(
    Organisation.getCustomizationUrl(organisation?.customizationUrl) ??
    Organisation.getCustomizationUrl(defaultCustomizationUrl),
  )

  useEffect(() => {
    if (!initCustomization) {
      return
    }

    dispatch(setCustomization(initCustomization()))
  }, [dispatch, initCustomization])

  if (isCustomizationFailed) {
    // TODO #4162
    return <OrganisationSettingsFailure />
  }

  if (
    (organisation?.customizationUrl || defaultCustomizationUrl) &&
    !isCustomizationReady
  ) {
    return <Spin.Centered spinning />
  }

  return children
}

OrganisationSettings.propTypes = {
  children: childrenShape,
}

export {
  OrganisationSettings,
}
