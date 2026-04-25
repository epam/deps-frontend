
import PropTypes from 'prop-types'
import {
  useMemo,
  useCallback,
  useState,
} from 'react'
import { useCreateBatchFromFileMutation } from '@/apiRTK/filesApi'
import { Button } from '@/components/Button'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { usePdfSegments, useUploadFiles } from '@/containers/PdfSplitting/hooks'
import { LocalBoundary } from '@/containers/PdfSplitting/LocalBoundary'
import { PdfSegments } from '@/containers/PdfSplitting/PdfSegments'
import { NotificationModal } from '@/containers/PdfSplitting/PdfSplittingButton/NotificationModal'
import { PdfThumbnailsMap } from '@/containers/PdfSplitting/PdfThumbnailsMap'
import { PdfSplitter } from '@/containers/PdfSplitting/services'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { fileShape } from '@/models/File'
import { FileCache } from '@/services/FileCache'
import { apiMap } from '@/utils/apiMap'
import { notifyWarning } from '@/utils/notification'
import {
  DrawerHeaderWrapper,
  StyledDrawer,
  StyledSpin,
} from './FilePDFSplittingButton.styles'

const DRAWER_WIDTH = '90%'

export const FilePDFSplittingButton = ({ file, children, disabled }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [isSplitting, setIsSplitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const { segments, selectedGroup } = usePdfSegments()
  const { uploadFiles } = useUploadFiles()
  const [createBatchFromFile] = useCreateBatchFromFileMutation()

  const getContainer = useCallback(() => document.body, [])

  const toggleDrawerVisibility = () => setIsDrawerVisible((prev) => !prev)

  const createFileBatch = useCallback(async (batchName) => {
    try {
      toggleDrawerVisibility()
      setIsSplitting(true)

      const binaryFiles = await PdfSplitter.getSplittedFilesData({
        documentName: file.name,
        pdfFile,
        segments,
      })

      const uploadedFiles = await uploadFiles(binaryFiles)

      const files = uploadedFiles.map(({ path, name, documentTypeId }) => ({
        path,
        name,
        documentTypeId,
        processingParams: {},
      }))

      await createBatchFromFile({
        fileId: file.id,
        data: {
          batchName,
          groupId: selectedGroup?.id,
          files,
        },
      }).unwrap()
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    } finally {
      setIsSplitting(false)
    }
  }, [
    file.id,
    file.name,
    createBatchFromFile,
    pdfFile,
    segments,
    selectedGroup,
    uploadFiles,
  ])

  const fetchPDF = useCallback(async () => {
    try {
      setFetching(true)
      const fileUrl = apiMap.apiGatewayV2.v5.file.blob(file.path)

      let pdf = await FileCache.get(fileUrl)

      if (!pdf) {
        const cachedData = await FileCache.requestAndStore([fileUrl])
        pdf = cachedData[fileUrl]
      }

      setPdfFile(pdf)
    } catch (e) {
      const errorCode = e?.response?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
      setIsError(true)
    } finally {
      setFetching(false)
    }
  }, [file.path])

  const onClickHandler = useCallback(() => {
    if (!disabled) {
      toggleDrawerVisibility()
      fetchPDF()
    }
  }, [fetchPDF, disabled])

  const DrawerTitle = useMemo(() => (
    <DrawerHeaderWrapper>
      {localize(Localization.SPLIT_FILE)}
    </DrawerHeaderWrapper>
  ), [])

  const Content = useMemo(() => {
    if (isError) {
      return <LocalBoundary />
    }

    if (fetching) {
      return <StyledSpin spinning />
    }

    return (
      <>
        <PdfThumbnailsMap
          pdfFile={pdfFile}
          withTitle
        />
        {
          !!segments.length && (
            <PdfSegments
              onCancel={toggleDrawerVisibility}
              onSave={createFileBatch}
            />
          )
        }
      </>
    )
  }, [
    isError,
    fetching,
    pdfFile,
    segments.length,
    createFileBatch,
  ])

  if (isSplitting) {
    return <NotificationModal setIsVisible={setIsSplitting} />
  }

  return (
    <>
      <Button.Text
        disabled={disabled}
        onClick={onClickHandler}
      >
        {children}
      </Button.Text>
      <StyledDrawer
        closeIcon={false}
        destroyOnClose
        getContainer={getContainer}
        onClose={toggleDrawerVisibility}
        open={isDrawerVisible}
        placement={Placement.RIGHT}
        title={DrawerTitle}
        width={DRAWER_WIDTH}
      >
        <ErrorBoundary localBoundary={() => <LocalBoundary />}>
          {Content}
        </ErrorBoundary>
      </StyledDrawer>
    </>
  )
}

FilePDFSplittingButton.propTypes = {
  file: fileShape.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
}
