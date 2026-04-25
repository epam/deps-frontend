
import { useCallback } from 'react'
import { useCreateAzureExtractorMutation } from '@/apiRTK/documentTypeApi'
import { AzureExtractorDrawer } from '@/containers/AzureExtractorDrawer'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { childrenShape } from '@/utils/propTypes'
import { goTo } from '@/utils/routerActions'

const CreateAzureExtractorDrawer = ({
  children,
}) => {
  const [
    createAzureExtractor,
    { isLoading: isCreating },
  ] = useCreateAzureExtractorMutation()

  const saveExtractor = useCallback(async (data) => {
    try {
      const { extractorId } = await createAzureExtractor(data).unwrap()

      goTo(navigationMap.documentTypes.documentType(extractorId))
      notifySuccess(localize(Localization.AZURE_CLOUD_NATIVE_EXTRACTOR_SUCCESS_CREATION))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR_MESSAGE)
      notifyWarning(message)
    }
  }, [createAzureExtractor])

  return (
    <AzureExtractorDrawer
      isLoading={isCreating}
      onSave={saveExtractor}
    >
      {children}
    </AzureExtractorDrawer>
  )
}

CreateAzureExtractorDrawer.propTypes = {
  children: childrenShape,
}

export {
  CreateAzureExtractorDrawer,
}
