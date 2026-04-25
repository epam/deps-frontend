import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/Button'
import { UiKeys, FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { FilePreview } from '@/containers/FilePreview'
import { PromptCalibrationStudio } from '@/containers/PromptCalibrationStudio'
import { useManageDocumentType } from '@/containers/PromptCalibrationStudio/hooks'
import { useQueryParams } from '@/hooks/useQueryParams'
import { localize, Localization } from '@/localization/i18n'
import { uiSelector } from '@/selectors/navigation'
import { CommitDocumentTypeModal } from '../CommitDocumentTypeModal'
import {
  Modal,
  ModalContent,
  ModalTitle,
  LeftPanel,
  RightPanel,
  Footer,
} from './FilePromptCalibrationStudioModal.styles'

const PROMPT_CALIBRATION_MODAL_WIDTH = 'calc(100vw - 4.8rem)'

export const FilePromptCalibrationStudioModal = () => {
  const [isCommitDocumentTypeModalVisible, setIsCommitDocumentTypeModalVisible] = useState(false)
  const [calibrationValues, setCalibrationValues] = useState(null)
  const [isModalRendered, setIsModalRendered] = useState(false)

  const { queryParams, setQueryParams } = useQueryParams()

  const activePage = useSelector(uiSelector)[UiKeys.ACTIVE_PAGE] || 1

  const { manageDocumentType, isManaging } = useManageDocumentType()

  const isVisible = !!queryParams[FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]

  const close = useCallback(() => {
    setQueryParams({
      [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: undefined,
    })

    setIsModalRendered(false)
  }, [setQueryParams])

  const toggleCommitDocumentTypeModalVisibility = useCallback(() => {
    setIsCommitDocumentTypeModalVisible((visible) => !visible)
  }, [])

  const onModalRender = useCallback((node) => {
    if (node) {
      setIsModalRendered(true)
    }
  }, [])

  const onCommit = useCallback(async (documentTypeName) => {
    const onAfterCommit = () => {
      setIsCommitDocumentTypeModalVisible(false)
      close()
    }

    const data = {
      documentTypeName,
      ...calibrationValues,
    }

    await manageDocumentType(data)

    onAfterCommit()
  }, [
    calibrationValues,
    close,
    manageDocumentType,
  ])

  const renderFooter = useCallback(() => (
    <Footer>
      <Button.Secondary onClick={close}>
        {localize(Localization.CLOSE_STUDIO)}
      </Button.Secondary>
      <CommitDocumentTypeModal
        isDisabled={!calibrationValues?.fields.length || !!calibrationValues.calibrationMode}
        isLoading={isManaging}
        isVisible={isCommitDocumentTypeModalVisible}
        onCommit={onCommit}
        toggleModalVisibility={toggleCommitDocumentTypeModalVisibility}
      />
    </Footer>
  ), [
    close,
    calibrationValues?.fields.length,
    calibrationValues?.calibrationMode,
    isManaging,
    isCommitDocumentTypeModalVisible,
    onCommit,
    toggleCommitDocumentTypeModalVisibility,
  ])

  const Title = useMemo(() => (
    <ModalTitle>{localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO)}</ModalTitle>
  ), [])

  return (
    <Modal
      centered
      closable={false}
      destroyOnClose
      footer={renderFooter()}
      keyboard={false}
      maskClosable={false}
      onCancel={close}
      open={isVisible}
      title={Title}
      width={PROMPT_CALIBRATION_MODAL_WIDTH}
    >
      <ModalContent ref={onModalRender}>
        <LeftPanel>
          {
            isModalRendered && (
              <FilePreview
                activePage={activePage}
              />
            )
          }
        </LeftPanel>
        <RightPanel>
          <PromptCalibrationStudio
            setCalibrationValues={setCalibrationValues}
          />
        </RightPanel>
      </ModalContent>
    </Modal>
  )
}
