
import { Resizable } from 're-resizable'
import { useCallback } from 'react'
import { Grid } from '@/components/Grid'
import { Content, Layout } from '@/components/Layout'
import { ReviewLayout } from '@/components/Layout/ReviewLayout'
import { PAGE_SEPARATOR_POSITION } from '@/constants/storage'
import { FileLayout } from '@/containers/FileLayout'
import { FilePreview } from '@/containers/FilePreview'
import { FilePromptCalibrationStudio } from '@/containers/FilePromptCalibrationStudio'
import { FileViewHeader } from '@/containers/FileViewHeader'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'
import {
  Column,
  RightResizablePage,
  ResizableWrapper,
  PageSeparator,
} from './FileReview.styles'

const CONTAINER_CLASS_NAME = 'antdModalContainer'
const PAGE_HALF_COLSPAN = 12
const MIN_WIDTH_LEFT = 500
const MAX_WIDTH_LEFT = '65%'
const DEFAULT_WIDTH = '45%'
const DEFAULT_HEIGHT = '100%'

const FileReview = () => {
  const leftColumnWidth = sessionStorageWrapper.getItem(PAGE_SEPARATOR_POSITION)

  const onResizeStop = useCallback((_, __, ref) => {
    const relativeWidth = ref.style.width
    sessionStorageWrapper.setItem(PAGE_SEPARATOR_POSITION, relativeWidth)
  }, [])

  return (
    <>
      <FilePromptCalibrationStudio />
      <Content>
        <ReviewLayout>
          <FileViewHeader />
          <Layout.Content>
            <Grid.Row>
              <ResizableWrapper>
                <Resizable
                  defaultSize={
                    {
                      width: leftColumnWidth || DEFAULT_WIDTH,
                      height: DEFAULT_HEIGHT,
                    }
                  }
                  enable={
                    {
                      right: true,
                    }
                  }
                  maxWidth={MAX_WIDTH_LEFT}
                  minWidth={MIN_WIDTH_LEFT}
                  onResizeStop={onResizeStop}
                >
                  <Column
                    span={PAGE_HALF_COLSPAN}
                  >
                    <FilePreview />
                  </Column>
                </Resizable>
                <PageSeparator />
                <RightResizablePage>
                  <Column
                    className={CONTAINER_CLASS_NAME}
                    span={PAGE_HALF_COLSPAN}
                  >
                    <FileLayout />
                  </Column>
                </RightResizablePage>
              </ResizableWrapper>
            </Grid.Row>
          </Layout.Content>
        </ReviewLayout>
      </Content>
    </>
  )
}

export {
  FileReview,
}
