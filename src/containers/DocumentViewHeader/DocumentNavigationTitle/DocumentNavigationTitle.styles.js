
import styled from 'styled-components'
import { LongText } from '@/components/LongText'
import { Spin } from '@/components/Spin'
import { TableActionIcon } from '@/components/TableActionIcon'
import { DocumentStatus } from '@/containers/DocumentStatus'

const StyledTableActionIcon = styled(TableActionIcon)`
  svg {
    path {
      fill: ${(props) => props.theme.color.grayscale12};
    }
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const DocumentType = styled(LongText)`
  color: ${(props) => props.theme.color.grayscale11};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2rem;
`

const DocumentDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const DocumentTitleWrapper = styled.div`
  display: flex;
  gap: 0.4rem;
`

const DocumentTitle = styled(LongText)`
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 2.2rem;
  max-width: 45rem;
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

const StyledDocumentStatus = styled(DocumentStatus)`
  .ant-badge-status-text {
    color: ${(props) => props.theme.color.grayscale11};
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 2rem;
  }
`

const Spinner = styled(Spin)`
  max-width: 35rem;
`

export {
  Wrapper,
  DocumentType,
  DocumentDataWrapper,
  DocumentTitle,
  DocumentTitleWrapper,
  InfoSeparator,
  InfoWrapper,
  StyledDocumentStatus as DocumentStatus,
  StyledTableActionIcon as TableActionIcon,
  Spinner,
}
