
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { FilesPicker, PICKER_TYPES } from '@/components/FilesPicker'
import { UploadFilledIcon } from '@/components/Icons/UploadFilledIcon'

const StyledFilesPicker = styled(FilesPicker)`
  &&& {
    height: auto;

    ${({ type }) => type === PICKER_TYPES.DRAGGER && css`
      border: 1px solid ${(props) => props.theme.color.grayscale19};
      border-radius: 2.4rem;
      background-color: ${(props) => props.theme.color.primary5};
  `}
  }

  span.ant-upload.ant-upload-btn {
    height: auto;
    padding: 2.5rem 0;
  }

  && .ant-upload-drag-container {
    & .ant-upload-hint {
      font-size: 1rem;
      font-weight: 600;
    }

    & .ant-upload-text {
      font-size: 1.4rem;
    }

    & .ant-upload-drag-icon {
      margin-bottom: 1rem;
    }
  }
`

const FilePickerWrapper = styled.div`
  && .ant-btn {
    border-color: transparent;
    padding: 0.6rem 1.5rem 0.4rem;

    &:hover {
      background-color: transparent;
      opacity: 0.5;
    }
  }
`

const StyledButton = styled(Button)`
  padding: 0 2rem;
  border-color: ${(props) => props.theme.color.primary2};
  color: ${(props) => props.theme.color.primary2};
`

const UploadIcon = styled(UploadFilledIcon)`
  margin-right: 1rem;
`

export {
  StyledFilesPicker as FilesPicker,
  StyledButton as Button,
  FilePickerWrapper,
  UploadIcon,
}
