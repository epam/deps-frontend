
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { FieldLabel } from '@/containers/DocumentField'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'

const FieldLabelAdapter = ({ dtField, active }) => {
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)

  const Label = useCallback(() => (
    <FieldLabel
      name={dtField.name}
      required={dtField.required}
    />
  ), [dtField])

  if (!customization.FieldLabel) {
    return <Label />
  }

  return (
    <ErrorBoundary
      localBoundary={() => <Label />}
    >
      <ModuleLoader
        url={
          customization.FieldLabel.getUrl(
            user.organisation.customizationUrl ||
            user.defaultCustomizationUrl,
          )
        }
      >
        {
          (CustomLabel) => (
            <CustomLabel
              active={active}
              dtField={dtField}
            >
              <Label />
            </CustomLabel>
          )
        }
      </ModuleLoader>
    </ErrorBoundary>
  )
}

FieldLabelAdapter.propTypes = {
  dtField: documentTypeFieldShape.isRequired,
  active: PropTypes.bool,
}

export { FieldLabelAdapter }
