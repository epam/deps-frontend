
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { fetchDocumentType } from '@/actions/documentType'
import { createExtraField } from '@/api/enrichmentApi'
import { ModalOptionTrigger } from '@/components/ModalOptionTrigger'
import { ExtraFieldDrawer } from '@/containers/ExtraFieldDrawer'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { FieldType } from '@/enums/FieldType'
import { localize, Localization } from '@/localization/i18n'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const initialField = new DocumentTypeExtraField({
  name: '',
  type: FieldType.STRING,
  autoFilled: false,
  code: uuidv4(),
  order: 0,
})

const AddExtraFieldSection = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [extraField, setExtraField] = useState(initialField)

  const dispatch = useDispatch()
  const documentType = useSelector(documentTypeStateSelector)

  const refreshDocumentType = () => {
    dispatch(fetchDocumentType(
      documentType.code,
      [DocumentTypeExtras.EXTRA_FIELDS]),
    )
  }

  const toggleDrawer = () => {
    setExtraField(initialField)
    setIsDrawerVisible((prev) => !prev)
  }

  const createField = async ({ name, order }) => {
    try {
      setIsCreating(true)
      await createExtraField(documentType.code, {
        name,
        order,
      })
      notifySuccess(localize(Localization.FIELD_CREATION_SUCCESS_MESSAGE))
      toggleDrawer()
      await refreshDocumentType()
    } catch (e) {
      const errorCode = e?.response?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <ModalOptionTrigger
        description={localize(Localization.EXTRA_FIELD_DESCRIPTION)}
        onClick={toggleDrawer}
        title={localize(Localization.EXTRA_FIELD)}
      />
      <ExtraFieldDrawer
        closeDrawer={toggleDrawer}
        field={extraField}
        isFieldCreationMode
        isLoading={isCreating}
        onSubmit={createField}
        setField={setExtraField}
        visible={isDrawerVisible}
      />
    </>
  )
}

export {
  AddExtraFieldSection,
}
