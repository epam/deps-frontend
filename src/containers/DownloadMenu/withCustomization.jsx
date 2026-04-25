
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useCustomization } from '@/hooks/useCustomization'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'

const withCustomization = (Component) => {
  const Wrapper = ({ ...props }) => {
    const customization = useSelector(customizationSelector)
    const user = useSelector(userSelector)

    const url = useMemo(() => (
      customization?.GetApiUrl?.getUrl(
        user.organisation.customizationUrl ||
        user.defaultCustomizationUrl,
      )
    ), [customization, user])

    const { module: customizationCallback } = useCustomization(url)

    const getApiUrl = (key) => {
      const { documentTypeCode, documentId } = props

      return customizationCallback(
        documentId,
        documentTypeCode,
        key,
      )
    }

    return (
      <Component
        {...props}
        getApiUrl={customizationCallback && getApiUrl}
      />
    )
  }

  Wrapper.propTypes = {
    documentId: PropTypes.string,
    documentTypeCode: PropTypes.string,
  }

  return Wrapper
}

export {
  withCustomization,
}
