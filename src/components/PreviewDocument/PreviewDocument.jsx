
import PropTypes from 'prop-types'
import { FileIcon } from '@/components/Icons/FileIcon'
import {
  Wrapper,
  NumberOfChildDocuments,
  IconWrapper,
  ExtensionText,
} from './PreviewDocument.styles'

const TEST_ID = {
  TEXT_EXTENSION_TEXT: 'file-extension-text',
  DOCUMENTS_COUNT: 'documents-count',
}

const DocumentFileIcon = ({ fileExtension }) => (
  <IconWrapper>
    <FileIcon />
    {
      fileExtension && (
        <ExtensionText
          data-testid={TEST_ID.TEXT_EXTENSION_TEXT}
        >
          {fileExtension}
        </ExtensionText>
      )
    }
  </IconWrapper>
)

DocumentFileIcon.propTypes = {
  fileExtension: PropTypes.string,
}

const PreviewDocument = ({ childDocuments, fileExtension }) => (
  <Wrapper>
    <DocumentFileIcon fileExtension={fileExtension} />
    {
      childDocuments && (
        <NumberOfChildDocuments data-testid={TEST_ID.DOCUMENTS_COUNT}>
          {childDocuments}
        </NumberOfChildDocuments>
      )
    }
  </Wrapper>
)

PreviewDocument.propTypes = {
  childDocuments: PropTypes.number,
  fileExtension: PropTypes.string,
}

export {
  PreviewDocument,
}
