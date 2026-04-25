
import { useCallback, useMemo } from 'react'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { useQueryParams } from '@/hooks/useQueryParams'
import { localize, Localization } from '@/localization/i18n'
import { NotConfiguredState } from './NotConfiguredState'
import {
  ModalContent,
  ModalTitle,
  Footer,
} from './NotConfiguredStateModal.styles'

export const NotConfiguredStateModal = () => {
  const { queryParams, setQueryParams } = useQueryParams()

  const isVisible = !!queryParams[DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]

  const handleClose = useCallback(() => {
    setQueryParams({
      [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: undefined,
    })
  }, [setQueryParams])

  const renderFooter = useCallback(() => (
    <Footer>
      <Button.Secondary onClick={handleClose}>
        {localize(Localization.CLOSE_STUDIO)}
      </Button.Secondary>
    </Footer>
  ), [handleClose])

  const Title = useMemo(() => (
    <ModalTitle>{localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO)}</ModalTitle>
  ), [])

  return (
    <Modal
      centered
      closable={false}
      destroyOnClose
      footer={renderFooter()}
      maskClosable={false}
      onCancel={handleClose}
      open={isVisible}
      title={Title}
    >
      <ModalContent>
        <NotConfiguredState />
      </ModalContent>
    </Modal>
  )
}
