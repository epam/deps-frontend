
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { BackToSourceButton } from '@/containers/BackToSourceButton'
import { FileReviewControls } from '@/containers/FileReviewControls'
import { navigationMap } from '@/utils/navigationMap'
import { FileNavigationTitle } from './FileNavigationTitle'
import {
  Header,
  CommandsSeparator,
  InfoWrapper,
  Wrapper,
  LongLabelsList,
} from './FileViewHeader.styles'

const FileViewHeader = () => {
  const { fileId } = useParams()
  const { data: file } = useFetchFileQuery(fileId)

  const labelsList = useMemo(() => {
    return file.labels.map((label, index) => ({
      _id: `${label}-${index}`,
      name: label,
    }))
  }, [file.labels])

  return (
    <Wrapper>
      <Header>
        <BackToSourceButton sourcePath={navigationMap.files()} />
        <InfoWrapper>
          <FileNavigationTitle />
          {
            !!labelsList.length && (
              <LongLabelsList
                documentId={file.id}
                labels={labelsList}
              />
            )
          }
        </InfoWrapper>
        {!!labelsList.length && <CommandsSeparator />}
        <FileReviewControls />
      </Header>
    </Wrapper>
  )
}

export {
  FileViewHeader,
}
