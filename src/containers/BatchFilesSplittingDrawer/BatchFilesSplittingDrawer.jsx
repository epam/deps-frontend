
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { Button, ButtonType } from '@/components/Button'
import { ArrowRightOutlined } from '@/components/Icons/ArrowRightOutlined'
import { PdfSplittingLayout } from '@/containers/PdfSplitting'
import { Localization, localize } from '@/localization/i18n'
import {
  DrawerFooterWrapper,
  StyledDrawer,
  UploadButton,
  ErrorMessageWrapper,
  ErrorIcon,
  ButtonsWrapper,
} from './BatchFilesSplittingDrawer.styles'
import { DRAWER_WIDTH_DEFAULT, MAX_FILES_COUNT_FOR_ONE_BATCH } from './constants'
import { DrawerHeader } from './DrawerHeader'
import { FilesCounter } from './FilesCounter'
import { useFilesSplitting } from './hooks'
import { mapFilesToFilesData } from './mappers'
import { FilesSplittingProvider } from './providers'
import { getCurrentFilesCount } from './utils'
import { SplittableFile } from './viewModels'

const BatchFilesSplittingDrawer = ({
  isVisible,
  onClose,
  onSubmit,
}) => {
  const {
    splittableFiles,
    batchFiles,
    currentFileIndex,
    setSplittableFile,
    setCurrentFileIndex,
  } = useFilesSplitting()

  const getContainer = useCallback(() => document.body, [])

  const setSegmentsToFile = useCallback((segments) => {
    setSplittableFile(splittableFiles.map((file, index) => {
      if (index === currentFileIndex) {
        return SplittableFile.setSegments(file, segments)
      }

      return file
    }))
  }, [
    currentFileIndex,
    splittableFiles,
    setSplittableFile,
  ])

  const onCloseHandler = useCallback(() => {
    onClose()
    setCurrentFileIndex(0)
  }, [onClose, setCurrentFileIndex])

  const submitData = useCallback(async () => {
    const filesData = await mapFilesToFilesData(splittableFiles, batchFiles)

    onSubmit(filesData)
    onCloseHandler()
  }, [
    splittableFiles,
    onSubmit,
    batchFiles,
    onCloseHandler,
  ])

  const isUploadFilesLimitExceeded = (
    getCurrentFilesCount(splittableFiles, batchFiles.length) > MAX_FILES_COUNT_FOR_ONE_BATCH
  )

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <FilesCounter />
      {
        isUploadFilesLimitExceeded && (
          <ErrorMessageWrapper>
            <ErrorIcon />
            {localize(Localization.FILES_LIMIT_EXCEEDED_COMBINE_OR_DIVIDE)}
          </ErrorMessageWrapper>
        )
      }
      <ButtonsWrapper>
        <Button onClick={onCloseHandler}>
          {localize(Localization.PREVIOUS_STEP)}
        </Button>
        <UploadButton
          disabled={isUploadFilesLimitExceeded}
          onClick={submitData}
          type={ButtonType.PRIMARY}
        >
          {localize(Localization.UPLOAD)}
          <ArrowRightOutlined />
        </UploadButton>
      </ButtonsWrapper>
    </DrawerFooterWrapper>
  ), [
    isUploadFilesLimitExceeded,
    onCloseHandler,
    submitData,
  ])

  return (
    <StyledDrawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={getContainer}
      hasCloseIcon={false}
      onClose={onCloseHandler}
      open={isVisible}
      title={<DrawerHeader />}
      width={DRAWER_WIDTH_DEFAULT}
    >
      <PdfSplittingLayout
        key={currentFileIndex}
        defaultBatchName={splittableFiles[currentFileIndex]?.batchName}
        defaultSegments={splittableFiles[currentFileIndex]?.segments}
        onChange={setSegmentsToFile}
        pdfFile={splittableFiles[currentFileIndex]?.source}
      />
    </StyledDrawer>
  )
}

BatchFilesSplittingDrawer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

const BatchFilesSplittingDrawerWithProvider = (props) => (
  <FilesSplittingProvider {...props}>
    <BatchFilesSplittingDrawer {...props} />
  </FilesSplittingProvider>
)

export { BatchFilesSplittingDrawerWithProvider as BatchFilesSplittingDrawer }
