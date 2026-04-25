
import PropTypes from 'prop-types'
import { useRestartFileMutation } from '@/apiRTK/filesApi'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { fileShape } from '@/models/File'
import { notifySuccess, notifyWarning } from '@/utils/notification'

export const FileRestartButton = ({
  file,
  className,
}) => {
  const [restartFile, { isLoading }] = useRestartFileMutation()

  const handleRestart = async () => {
    try {
      await restartFile(file.id).unwrap()
      notifySuccess(localize(Localization.RESTART_FILE_SUCCESS))
    } catch (e) {
      const message = RESOURCE_ERROR_TO_DISPLAY[e.data?.code] ?? localize(Localization.RESTART_FILE_FAILED)
      notifyWarning(message)
    }
  }

  const confirmRestart = (e) => {
    e?.stopPropagation()

    Modal.confirm({
      title: localize(Localization.RESTART_FILE_CONFIRM_MESSAGE),
      onOk: handleRestart,
    })
  }

  return (
    <Button.Text
      className={className}
      disabled={isLoading}
      onClick={confirmRestart}
    >
      {localize(Localization.RESTART_FILE)}
    </Button.Text>
  )
}

FileRestartButton.propTypes = {
  file: fileShape.isRequired,
  className: PropTypes.string,
}
