import styled from 'styled-components'
import { Button as ButtonComponent } from '@/components/Button'
import { FilesPicker as FilesPickerComponent } from '@/components/FilesPicker'
import { UploadFilledIcon } from '@/components/Icons/UploadFilledIcon'

export const UploadIcon = styled(UploadFilledIcon)`
  margin-right: 1rem;
`

export const Button = styled(ButtonComponent)`
  padding: 0 2rem;
  color: ${(props) => props.theme.color.primary2};
`

export const AddFilesButton = styled(FilesPickerComponent)`
  background-color: ${(props) => props.theme.color.primary3};
  color: ${(props) => props.theme.color.primary2};
  border-radius: 0.4rem;

  .ant-upload {
    padding: 0 !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
`

export const FilesPicker = styled(FilesPickerComponent)`
  &&& {
    height: auto;
    border: 1px solid ${(props) => props.theme.color.grayscale1};
    border-radius: 0.4rem;
    background-color: ${(props) => props.theme.color.grayscale14};

    .ant-upload {
      padding: ${(props) => (props.$hasPickedFiles ? '1.6rem' : '4.4rem 1.2rem')};
    }

    .ant-upload-hint {
      font-size: 1.2rem;
    }
  }
`

export const FilesPickerUploadButton = styled(Button)`
  align-items: center; 
  padding: 1.2rem 2rem;
  background-color: ${(props) => props.theme.color.grayscale14};
  border-radius: 0.4rem;
  box-shadow: none;
  color: ${(props) => props.theme.color.primary1};
  display: flex;
  justify-content: center;
  width: 100%;

  &.ant-btn-ghost {
    border: 1px solid ${(props) => props.theme.color.grayscale21};
  }

  &.ant-btn-ghost:hover,
  &.ant-btn-ghost:active {
    color: ${(props) => props.theme.color.primary1};
    border-color: ${(props) => props.theme.color.primary2};
  }

  &::after {
    all: unset;
  }
`

const ButtonContentWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  width: 100%;
  grid-gap: 0.8rem;
`

export const ButtonContentBorderlessWrapper = styled(ButtonContentWrapper)`
  justify-content: center;
  gap: 0.8rem;
`

export const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1.6rem;
  height: 100%;
  padding: 2rem 1rem;
  background-color: ${(props) => props.theme.color.grayscale14};
  border: 1px solid ${(props) => props.theme.color.grayscale15};

  & > div {
    padding-inline: 1rem;
  }
`

export const FilesWrapper = styled.div`
  display: grid;
  grid-template-columns: 100%;
  align-content: start;
  grid-gap: 1.6rem;
  overflow-x: hidden;
  height: 100%;
`
