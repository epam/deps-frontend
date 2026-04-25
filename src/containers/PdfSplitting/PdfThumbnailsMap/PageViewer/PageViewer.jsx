
import { useState } from 'react'
import { Page } from 'react-pdf'
import { usePdfSegments } from '@/containers/PdfSplitting/hooks'
import { Controls } from '../Controls'
import {
  Header,
  PageNumberCorner,
  PageWrapper,
} from './PageViewer.styles'

const MAX_SCALE = 3
const MIN_SCALE = 0.5
const SCALE_STEP = 0.1

export const PageViewer = () => {
  const [scale, setScale] = useState(1)

  const { activeUserPage } = usePdfSegments()

  const onWheelHandler = (e) => {
    if (!e.altKey) {
      return
    }

    if (e.deltaY > 0) {
      setScale((prevScale) => Math.min(prevScale + SCALE_STEP, MAX_SCALE))
    }

    if (e.deltaY < 0) {
      setScale((prevScale) => Math.max(prevScale - SCALE_STEP, MIN_SCALE))
    }
  }

  return (
    <>
      <Header>
        <PageNumberCorner>{activeUserPage.page + 1}</PageNumberCorner>
        <Controls
          closable
          userPage={activeUserPage}
        />
      </Header>
      <PageWrapper onWheel={onWheelHandler}>
        <Page
          pageIndex={activeUserPage.page}
          renderAnnotationLayer={false}
          renderForms={false}
          renderTextLayer={false}
          scale={scale}
        />
      </PageWrapper>
    </>
  )
}
