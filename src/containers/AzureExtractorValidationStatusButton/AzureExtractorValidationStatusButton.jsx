
import {
  useCallback,
  useMemo,
} from 'react'
import {
  useCheckAzureExtractorQuery,
  useSynchronizeAzureExtractorMutation,
} from '@/apiRTK/documentTypeApi'
import { CalendarXmark } from '@/components/Icons/CalendarXmark'
import { ErrorTriangleIcon } from '@/components/Icons/ErrorTriangleIcon'
import { Tooltip } from '@/components/Tooltip'
import { EditAzureExtractorDrawer } from '@/containers/EditAzureExtractorDrawer'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import {
  Button,
  CircleCheckIcon,
  ErrorButton,
  RotateIcon,
  SpinnerIcon,
} from './AzureExtractorValidationStatusButton.styles'

const VALIDATION_STATUSES = {
  API_KEY_EXPIRED: 'API Key expired',
  ERROR: 'Error',
  SYNCHRONIZED: 'Synchronized',
  UNSYNCHRONIZED: 'Unsynchronized',
}

const AzureExtractorValidationStatusButton = ({ documentType }) => {
  const {
    data = {},
    error,
    isFetching,
    refetch,
  } = useCheckAzureExtractorQuery(
    documentType.code,
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const [
    synchronizeAzureExtractor,
    { isLoading: isSynchronizing },
  ] = useSynchronizeAzureExtractorMutation()

  const synchronizeExtractor = useCallback(async () => {
    try {
      await synchronizeAzureExtractor({
        documentTypeId: documentType.code,
      }).unwrap()

      notifySuccess(localize(Localization.AZURE_EXTRACTOR_SUCCESS_RESYNCHRONIZE))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR_MESSAGE)
      notifyWarning(message)
    }
  }, [
    documentType.code,
    synchronizeAzureExtractor,
  ])

  const SynchronizedButton = useMemo(() => (
    <Tooltip
      placement={Placement.BOTTOM}
      title={localize(Localization.SYNCHRONIZED)}
    >
      <Button
        icon={<CircleCheckIcon />}
      />
    </Tooltip>
  ), [])

  const UnsynchronizedButton = useMemo(() => (
    <Tooltip
      placement={Placement.BOTTOM}
      title={localize(Localization.RESYNCHRONIZE)}
    >
      <Button
        icon={<RotateIcon />}
        onClick={synchronizeExtractor}
      />
    </Tooltip>
  ), [synchronizeExtractor])

  const InProgressButton = useMemo(() => (
    <Tooltip
      placement={Placement.BOTTOM}
      title={localize(Localization.CONNECTION_PROGRESS)}
    >
      <Button
        icon={<SpinnerIcon />}
      />
    </Tooltip>
  ), [])

  const SpecificErrorButton = useMemo(() => (
    <Tooltip
      placement={Placement.BOTTOM}
      title={data?.description}
    >
      <ErrorButton
        onClick={refetch}
      >
        {localize(Localization.SPECIFIC_ERROR)}
        <RotateIcon />
      </ErrorButton>
    </Tooltip>
  ), [
    data,
    refetch,
  ])

  const UnspecifiedErrorButton = useMemo(() => (
    <ErrorButton>
      {localize(Localization.UNSPECIFIED_ERROR)}
      <ErrorTriangleIcon />
    </ErrorButton>
  ), [])

  const APIKeyExpiredButton = useMemo(() => (
    <EditAzureExtractorDrawer
      documentType={documentType}
    >
      <Tooltip
        placement={Placement.BOTTOM}
        title={localize(Localization.CHANGE_API_KEY)}
      >
        <ErrorButton>
          {localize(Localization.EXPIRED_API_KEY)}
          <CalendarXmark />
        </ErrorButton>
      </Tooltip>
    </EditAzureExtractorDrawer>
  ), [documentType])

  const getStatusButton = useCallback(() => {
    if (isFetching || isSynchronizing) {
      return InProgressButton
    }

    const statusToRenderMap = {
      [VALIDATION_STATUSES.SYNCHRONIZED]: SynchronizedButton,
      [VALIDATION_STATUSES.UNSYNCHRONIZED]: UnsynchronizedButton,
      [VALIDATION_STATUSES.API_KEY_EXPIRED]: APIKeyExpiredButton,
      [VALIDATION_STATUSES.ERROR]: SpecificErrorButton,
    }

    if (data?.status && statusToRenderMap[data.status]) {
      return statusToRenderMap[data.status]
    }

    if (error) {
      return UnspecifiedErrorButton
    }

    return null
  }, [
    data,
    error,
    isFetching,
    isSynchronizing,
    APIKeyExpiredButton,
    InProgressButton,
    SynchronizedButton,
    SpecificErrorButton,
    UnspecifiedErrorButton,
    UnsynchronizedButton,
  ])

  return getStatusButton()
}

AzureExtractorValidationStatusButton.propTypes = {
  documentType: documentTypeShape.isRequired,
}

export {
  AzureExtractorValidationStatusButton,
}
