
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { deleteDocumentOutput } from '@/api/outputProfilesApi'
import { ButtonType } from '@/components/Button'
import { ArrowDownSolidIcon } from '@/components/Icons/ArrowDownSolidIcon'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { Placement } from '@/enums/Placement'
import { useDownload } from '@/hooks/useDownload'
import { localize, Localization } from '@/localization/i18n'
import { apiMap } from '@/utils/apiMap'
import { getDownloadFileName } from '@/utils/file'
import { getFileExtension } from '@/utils/getFileExtension'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import {
  IconButton,
  CommandBar,
  DownloadButton,
} from './OutputCommandBar.styles'

const getTooltipConfig = (title) => ({
  placement: Placement.TOP_RIGHT,
  title,
})

const OutputCommandBar = ({
  isPending,
  filePath,
  name,
  documentId,
  outputId,
  reloadData,
}) => {
  const { downloadOutput, isLoading } = useDownload()

  const deleteOutput = useCallback(async () => {
    try {
      await deleteDocumentOutput(
        documentId,
        outputId,
      )
      notifySuccess(localize(Localization.DELETE_OUTPUT_SUCCESS_STATUS))
      await reloadData()
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }, [
    documentId,
    outputId,
    reloadData,
  ])

  const downloadProfileOutput = useCallback(() => {
    const fileName = getDownloadFileName({
      extension: getFileExtension(filePath ?? ''),
      title: name,
    })

    downloadOutput(apiMap.fileStorage.v1.file.output(filePath), fileName)
  }, [downloadOutput, filePath, name])

  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <IconButton
          icon={<TrashIcon />}
          onClick={deleteOutput}
          tooltip={
            getTooltipConfig(localize(Localization.DELETE_OUTPUT))
          }
        />
      ),
    },
    {
      renderComponent: () => (
        <DownloadButton
          disabled={isPending || isLoading}
          icon={<ArrowDownSolidIcon />}
          onClick={downloadProfileOutput}
          tooltip={
            getTooltipConfig(localize(Localization.DOWNLOAD_OUTPUT))
          }
          type={ButtonType.PRIMARY}
        />
      ),
    },
  ], [
    downloadProfileOutput,
    isLoading,
    isPending,
    deleteOutput,
  ])

  return (
    <CommandBar
      commands={commands}
    />
  )
}

OutputCommandBar.propTypes = {
  isPending: PropTypes.bool.isRequired,
  filePath: PropTypes.string.isRequired,
  name: PropTypes.string,
  documentId: PropTypes.string.isRequired,
  outputId: PropTypes.string.isRequired,
  reloadData: PropTypes.func.isRequired,
}

export {
  OutputCommandBar,
}
