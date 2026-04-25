
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { updateExtraFields } from '@/api/enrichmentApi'
import { PenIcon } from '@/components/Icons/PenIcon'
import { TableActionIcon } from '@/components/TableActionIcon'
import { ExtraFieldDrawer } from '@/containers/ExtraFieldDrawer'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const EditExtraFieldDrawerButton = ({
  documentTypeCode,
  field,
  onAfterEditing,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [extraField, setExtraField] = useState(field)

  const updateField = useCallback(async ({ code, name, order }) => {
    try {
      setIsUpdating(true)
      await updateExtraFields(
        documentTypeCode,
        [{
          code,
          name,
          order,
        }],
      )
      notifySuccess(localize(Localization.FIELD_UPDATE_SUCCESS_MESSAGE))
      setIsDrawerVisible(false)
      await onAfterEditing()
    } catch (e) {
      const errorCode = e?.response?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    } finally {
      setIsUpdating(false)
    }
  }, [
    documentTypeCode,
    onAfterEditing,
  ])

  const toggleDrawer = () => {
    setIsDrawerVisible((prev) => !prev)
  }

  const closeDrawer = () => {
    setExtraField(field)
    toggleDrawer()
  }

  return (
    <>
      <TableActionIcon
        disabled={isUpdating}
        icon={<PenIcon />}
        onClick={toggleDrawer}
      />
      <ExtraFieldDrawer
        closeDrawer={closeDrawer}
        field={extraField}
        isLoading={isUpdating}
        onSubmit={updateField}
        setField={setExtraField}
        visible={isDrawerVisible}
      />
    </>
  )
}

EditExtraFieldDrawerButton.propTypes = {
  onAfterEditing: PropTypes.func.isRequired,
  field: documentTypeExtraFieldShape.isRequired,
  documentTypeCode: PropTypes.string.isRequired,
}

export {
  EditExtraFieldDrawerButton,
}
