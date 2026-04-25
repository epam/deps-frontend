
import { useCallback, useState } from 'react'
import { Button, ButtonType } from '@/components/Button'
import { UploadIcon } from '@/components/Icons/UploadIcon'
import { DocumentUpload } from '@/containers/DocumentUpload'
import { localize, Localization } from '@/localization/i18n'

const UploadDocumentButton = () => {
  const [visible, setVisible] = useState(false)

  const onStartUploadClick = useCallback(() => {
    setVisible(true)
  }, [])

  const onClose = useCallback(() => {
    setVisible(false)
  }, [])

  return (
    <>
      <Button.Gradient
        icon={<UploadIcon />}
        onClick={onStartUploadClick}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.UPLOAD_DOCUMENTS)}
      </Button.Gradient>
      <DocumentUpload
        isVisible={visible}
        onClose={onClose}
      />
    </>
  )
}

export {
  UploadDocumentButton,
}
