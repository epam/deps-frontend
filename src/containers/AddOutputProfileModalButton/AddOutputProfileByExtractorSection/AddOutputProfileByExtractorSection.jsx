
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentType } from '@/actions/documentType'
import { createOutputProfile } from '@/api/outputProfilesApi'
import { ModalOptionTrigger } from '@/components/ModalOptionTrigger'
import { OutputProfileByExtractorDrawer } from '@/containers/OutputProfileByExtractorDrawer'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import {
  FILE_EXTENSION_TO_DOWNLOAD_FORMAT,
  FileExtension,
} from '@/enums/FileExtension'
import { StatusCode } from '@/enums/StatusCode'
import { Localization, localize } from '@/localization/i18n'
import { ExtractedDataSchema } from '@/models/OutputProfile'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const AddOutputProfileByExtractorSection = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const dispatch = useDispatch()
  const documentType = useSelector(documentTypeStateSelector)

  const refetchProfiles = () => {
    dispatch(fetchDocumentType(documentType.code, [DocumentTypeExtras.PROFILES]))
  }

  const initialProfile = {
    name: localize(Localization.DEFAULT_PROFILE_NAME, { name: documentType.name }),
    schema: new ExtractedDataSchema({
      fields: documentType.fields?.map((field) => field.code),
      needsValidationResults: true,
    }),
    format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.XLSX],
  }

  const createProfile = async ({ name, schema, format }) => {
    try {
      setIsCreating(true)
      await createOutputProfile({
        documentTypeId: documentType.code,
        name,
        schema,
        format,
      })
      notifySuccess(localize(Localization.PROFILE_CREATED))
      setIsDrawerVisible(false)
      await refetchProfiles()
    } catch (e) {
      if (e.request?.status === StatusCode.CONFLICT) {
        return notifyWarning(localize(Localization.OUTPUT_ALREADY_EXISTS))
      }
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsCreating(false)
    }
  }

  const toggleDrawer = () => setIsDrawerVisible((prev) => !prev)

  return (
    <>
      <ModalOptionTrigger
        description={localize(Localization.ADD_EXTRACTION_FIELDS_PROFILE_TOOLTIP)}
        onClick={toggleDrawer}
        title={localize(Localization.EXTRACTION_FIELDS_PROFILE)}
      />
      <OutputProfileByExtractorDrawer
        documentTypeFields={documentType.fields}
        isLoading={isCreating}
        onSubmit={createProfile}
        profile={initialProfile}
        setVisible={setIsDrawerVisible}
        visible={isDrawerVisible}
      />
    </>
  )
}

export {
  AddOutputProfileByExtractorSection,
}
