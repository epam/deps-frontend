
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { clearFileStore } from '@/actions/fileReviewPage'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { Spin } from '@/components/Spin'
import { FileReview } from '@/containers/FileReview'
import {
  useEventSource,
  KnownBusinessEvent,
} from '@/hooks/useEventSource'
import { ENV } from '@/utils/env'
import { goBack } from '@/utils/routerActions'

const FileReviewPage = () => {
  const { fileId } = useParams()
  const dispatch = useDispatch()
  const addEvent = useEventSource('FileReviewPage')

  const {
    data: file,
    isLoading,
    refetch: refetchFile,
  } = useFetchFileQuery(fileId, {
    skip: !fileId,
  })

  const onFileStatusUpdated = useCallback((eventData) => {
    if (eventData.fileId === fileId) {
      refetchFile()
    }
  }, [fileId, refetchFile])

  useEffect(() => {
    if (!fileId) {
      goBack()
    }
  }, [fileId])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    addEvent(KnownBusinessEvent.FILE_STATE_UPDATED, onFileStatusUpdated)
  }, [addEvent, onFileStatusUpdated])

  useEffect(() => {
    return () => {
      dispatch(clearFileStore())
    }
  }, [dispatch])

  if (!file || isLoading) {
    return <Spin.Centered spinning />
  }

  return <FileReview />
}

export {
  FileReviewPage,
}
