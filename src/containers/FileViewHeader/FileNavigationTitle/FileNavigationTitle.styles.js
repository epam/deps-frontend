
import styled from 'styled-components'
import { LongText } from '@/components/LongText'
import { Spin } from '@/components/Spin'
import { FileStatus as FileStatusComponent } from '@/containers/FileStatus'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const FileDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const FileName = styled(LongText)`
  color: ${(props) => props.theme.color.grayscale11};
  font-weight: 600;
  line-height: 2rem;
  font-size: 1.6rem;
`

const StyledFileStatus = styled(FileStatusComponent)`
  .ant-badge-status-text {
    color: ${(props) => props.theme.color.grayscale11};
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 2rem;
  }
`

const DocumentType = styled(LongText)`
  color: ${(props) => props.theme.color.grayscale11};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2rem;
`

const InfoWrapper = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
`

const InfoSeparator = styled.div`
  height: 2rem;
  width: 0.1rem;
  background-color: ${(props) => props.theme.color.grayscale17};
`

const Spinner = styled(Spin)`
  max-width: 35rem;
`

export {
  Wrapper,
  FileDataWrapper,
  FileName,
  StyledFileStatus as FileStatus,
  DocumentType,
  InfoWrapper,
  InfoSeparator,
  Spinner,
}
