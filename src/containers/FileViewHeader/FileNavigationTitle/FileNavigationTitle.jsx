
import { useParams } from 'react-router'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { FileReferenceInfo } from '../FileReferenceInfo'
import {
  FileDataWrapper,
  FileStatus,
  FileName,
  Wrapper,
  InfoWrapper,
} from './FileNavigationTitle.styles'

const FileNavigationTitle = () => {
  const { fileId } = useParams()
  const { data: file } = useFetchFileQuery(fileId)

  return (
    <Wrapper>
      <FileDataWrapper>
        <FileName text={file.name} />
        <InfoWrapper>
          <FileStatus
            status={file.state.status}
          />
          {
            file.reference && (
              <FileReferenceInfo reference={file.reference} />
            )
          }
        </InfoWrapper>
      </FileDataWrapper>
    </Wrapper>
  )
}

export {
  FileNavigationTitle,
}
