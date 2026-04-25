
import styled from 'styled-components'
import { FilesPicker } from '@/components/FilesPicker'
import { ComponentSize } from '@/enums/ComponentSize'

const SMALL_LIST_ITEM = `
  &:not(:last-child) {
    margin-bottom: 1rem;
}
`

const StyledFilesPicker = styled(FilesPicker)`
.ant-upload.ant-upload-select {
  display: block;
}
`

const DocumentUploadCard = styled.li`
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
  
  .ant-card-body {
    padding: 0;
  }
    
  .ant-card-bordered {
    border: 1px solid ${(props) => props.theme.color.grayscale1};
  }

  .ant-card-head {
    border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};
  }
  
  ${({ size }) => size === ComponentSize.SMALL && SMALL_LIST_ITEM}
`

const DocumentTitle = styled.span`
  display: block;
  padding-right: 1.2rem;
  max-width: 35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const OverrideDocumentOption = styled.span`
  font-size: 1.2rem;
  font-weight: lighter;
  display: block;
`

const WarningBanner = styled.div`
  .anticon-warning {
    margin-right: 0.5rem;
  }

  padding: 0 1rem;
  background: ${(props) => props.theme.color.warningBg};
`

export {
  DocumentUploadCard,
  DocumentTitle,
  OverrideDocumentOption,
  StyledFilesPicker as FilesPicker,
  WarningBanner,
}
