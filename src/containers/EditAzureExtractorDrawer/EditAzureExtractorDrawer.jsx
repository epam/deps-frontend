
import {
  useCallback,
  useMemo,
} from 'react'
import {
  useFetchAzureExtractorQuery,
  useUpdateAzureExtractorMutation,
} from '@/apiRTK/documentTypeApi'
import { AzureExtractorDrawer } from '@/containers/AzureExtractorDrawer'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { childrenShape } from '@/utils/propTypes'

const EditAzureExtractorDrawer = ({
  children,
  documentType,
}) => {
  const {
    data: azureExtractor = {},
    isLoading: isAzureExtractorLoading,
  } = useFetchAzureExtractorQuery(
    documentType.code,
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const [
    updateAzureExtractor,
    { isLoading: isUpdating },
  ] = useUpdateAzureExtractorMutation()

  const updateExtractor = useCallback(async (data) => {
    try {
      await updateAzureExtractor({
        documentTypeId: documentType?.code,
        credentials: {
          apiKey: data.apiKey,
          endpoint: data.endpoint,
          modelId: data.modelId,
        },
      }).unwrap()

      notifySuccess(localize(Localization.AZURE_CLOUD_NATIVE_EXTRACTOR_SUCCESS_UPDATE))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR_MESSAGE)
      notifyWarning(message)
    }
  }, [
    documentType?.code,
    updateAzureExtractor,
  ])

  const extractorData = useMemo(() => ({
    name: documentType?.name,
    credentials: {
      endpoint: azureExtractor?.endpoint,
      modelId: azureExtractor?.modelId,
    },
  }), [
    azureExtractor,
    documentType,
  ])

  return (
    <AzureExtractorDrawer
      extractorData={extractorData}
      isConnectionDataLoading={isAzureExtractorLoading}
      isLoading={isUpdating}
      onSave={updateExtractor}
    >
      {children}
    </AzureExtractorDrawer>
  )
}

EditAzureExtractorDrawer.propTypes = {
  children: childrenShape,
  documentType: documentTypeShape.isRequired,
}

export {
  EditAzureExtractorDrawer,
}
