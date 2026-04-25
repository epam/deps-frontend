
import {
  useMemo,
  useCallback,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import { useCreateBatchMutation } from '@/apiRTK/batchesApi'
import { Button } from '@/components/Button'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { documentSelector } from '@/selectors/documentReviewPage'
import { FileCache } from '@/services/FileCache'
import { apiMap } from '@/utils/apiMap'
import { notifyWarning } from '@/utils/notification'
import { usePdfSegments, useUploadFiles } from '../hooks'
import { LocalBoundary } from '../LocalBoundary'
import { PdfSegments } from '../PdfSegments'
import { PdfThumbnailsMap } from '../PdfThumbnailsMap'
import { PdfSplitter } from '../services'
import { NotificationModal } from './NotificationModal'
import {
  DrawerHeaderWrapper,
  StyledDrawer,
  StyledSpin,
} from './PdfSplittingButton.styles'

const DRAWER_WIDTH = '90%'

export const PdfSplittingButton = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [isSplitting, setIsSplitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const { segments, selectedGroup } = usePdfSegments()

  const { uploadFiles } = useUploadFiles()

  const [createBatch] = useCreateBatchMutation()

  const activeDocument = useSelector(documentSelector)

  const getContainer = useCallback(() => document.body, [])

  const toggleDrawerVisibility = () => setIsDrawerVisible((prev) => !prev)

  const createDocumentBatch = useCallback(async (batchName) => {
    try {
      toggleDrawerVisibility()
      setIsSplitting(true)

      const binaryFiles = await PdfSplitter.getSplittedFilesData({
        documentName: activeDocument.title,
        pdfFile,
        segments,
      })

      const uploadedFiles = await uploadFiles(binaryFiles)

      await createBatch({
        name: batchName,
        groupId: selectedGroup?.id,
        files: uploadedFiles,
      })
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    } finally {
      setIsSplitting(false)
    }
  }, [
    activeDocument.title,
    createBatch,
    pdfFile,
    segments,
    selectedGroup,
    uploadFiles,
  ])

  const fetchPDF = useCallback(async () => {
    try {
      setFetching(true)
      const [file] = activeDocument.files
      const fileUrl = apiMap.apiGatewayV2.v5.file.blob(file.blobName)

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
  }, [activeDocument.files])

  const onClickHandler = useCallback(() => {
    toggleDrawerVisibility()
    fetchPDF()
  }, [fetchPDF])

  const DrawerTitle = useMemo(() => (
    <DrawerHeaderWrapper>
      {localize(Localization.SPLIT_DOCUMENT)}
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
              onSave={createDocumentBatch}
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
    createDocumentBatch,
  ])

  if (isSplitting) {
    return <NotificationModal setIsVisible={setIsSplitting} />
  }

  return (
    <>
      <Button.Text onClick={onClickHandler}>
        {localize(Localization.SPLIT_DOCUMENT)}
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
