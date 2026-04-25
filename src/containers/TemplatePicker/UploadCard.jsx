
import PropTypes from 'prop-types'
import { FileImageIcon } from '@/components/Icons/FileImageIcon'
import { FileJPGIcon } from '@/components/Icons/FileJPGIcon'
import { FilePDFIcon } from '@/components/Icons/FilePDFIcon'
import { MimeType } from '@/enums/MimeType'
import { Localization, localize } from '@/localization/i18n'
import { getFileSizeStr } from '@/utils/file'
import {
  Wrapper,
  IconWrapper,
  ButtonWrapper,
  CardDescription,
  CardInfo,
  DocumentName,
  DocumentSize,
  TypographyText,
} from './UploadCard.styles'

const MIME_TO_ICON = {
  [MimeType.IMAGE_JPEG]: <FileJPGIcon />,
  [MimeType.APPLICATION_PDF]: <FilePDFIcon />,
}

const UploadCard = ({ file, children }) => {
  const getIcon = () => (
    MIME_TO_ICON[file.mime ?? file.type] ?? <FileImageIcon />
  )

  return (
    <Wrapper>
      <CardDescription>
        <IconWrapper>
          {getIcon()}
        </IconWrapper>
        <CardInfo>
          <DocumentName>
            <TypographyText
              content={file.name}
              ellipsis={{ tooltip: file.name }}
            />
          </DocumentName>
          <DocumentSize>
            {
              localize(Localization.FILE_SIZE, {
                size: getFileSizeStr(file.size),
              })
            }
          </DocumentSize>
        </CardInfo>
      </CardDescription>
      <ButtonWrapper>
        {children}
      </ButtonWrapper>
    </Wrapper>
  )
}

UploadCard.propTypes = {
  file: PropTypes.shape({
    uid: PropTypes.string,
    mime: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number,
  }).isRequired,
  children: PropTypes.element,
}

export {
  UploadCard,
}
