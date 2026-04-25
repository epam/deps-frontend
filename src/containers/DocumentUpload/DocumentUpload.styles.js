
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'
import { FilesPicker } from '@/components/FilesPicker'

const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;

  .ant-upload.ant-upload-drag {
    height: 35rem;
  }
`

const UploadContent = styled.div`
  padding: 1.6rem 1.6rem 0;
`

const UploadFilesList = styled.div`
  padding: 0 1.6rem;
`

const UploadButton = styled(Button)`
  width: 18rem;
  font-weight: 600;

  &&:disabled,
  &&:disabled:hover {
    background-color: ${(props) => props.theme.color.grayscale22};
    color: ${(props) => props.theme.color.grayscale1};
    opacity: 1;
    box-shadow : none;
  }
`

const UploadFooter = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  background: white;
  bottom: 0;
  padding: 0.5rem;
`

const StyledFilesPicker = styled(FilesPicker)`
  display: flex;
  margin-bottom: 1.6rem;

  & .ant-upload {
    width: 100%;
  }

  & button {
    display: flex;
    width: 100%;
  }
`

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }

  & .ant-drawer-header {
    position: relative;
    box-shadow: 0 0.6rem 0.8rem 0 ${(props) => props.theme.color.shadow2};
    z-index: 1;
  }

  & .ant-drawer-footer {
    position: relative;
    box-shadow: 0 -0.6rem 0.8rem 0 ${(props) => props.theme.color.shadow2};
  }

  ${(props) => props.open && css`
    && .ant-drawer-mask {
      animation: none;
    }
  `}
`

const TitleWrapper = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
`

const AdditionalSettingsButton = styled(Button)`
  padding: 0;
  margin: 0.8rem 0 1.6rem;
  font-weight: 600;
`

const FilesPickerSectionButton = styled(Button)`
  padding: 0;
  align-items: center; 
  height: 5.6rem;
  font-size: 1.6rem;

  &.ant-btn-ghost {
    border-color: ${(props) => props.theme.color.grayscale21};
    background-color: ${(props) => props.theme.color.grayscale14};
    color: ${(props) => props.theme.color.grayscale11};
  }
`

const FilesPickerUploadButton = styled(Button)`
  align-items: center; 
  height: 5.6rem;
  padding: 1.2rem 0 0.4rem;
  border: none;
  box-shadow: none;

  &.ant-btn-ghost {
    border-top: 1px solid ${(props) => props.theme.color.grayscale2};
  }

  &.ant-btn-ghost:hover,
  &.ant-btn-ghost:active {
    background-color: ${(props) => props.theme.color.primary3};
    color: ${(props) => props.theme.color.borderIcon};
  }

  &::after {
    all: unset;
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  width: 5rem;
  padding: 0;
  background-color: ${(props) => props.theme.color.grayscale20};
  border-radius: 50%;
`

const IconWrapperCropped = styled(IconWrapper)`
  height: 100%;
  width: 4.8rem;
  border-radius: 4px 50% 50% 4px;
  background-color: ${(props) => props.theme.color.primary3};
`

const ButtonContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 1.6rem;
`

const ButtonContentBorderlessWrapper = styled(ButtonContentWrapper)`
  justify-content: start;
  border: none;
  padding-left: 0.8rem;

  & > svg {
    margin-right: 0.3rem;
  }
`

const StoragesWrapper = styled.div`
  flex: 1 1;
  padding-inline: 1.6rem;
  margin-bottom: 1rem;
`

export {
  UploadWrapper,
  UploadFooter,
  UploadContent,
  UploadFilesList,
  UploadButton,
  StyledFilesPicker as FilesPicker,
  StyledDrawer as Drawer,
  TitleWrapper,
  AdditionalSettingsButton,
  IconWrapperCropped,
  IconWrapper,
  FilesPickerUploadButton,
  FilesPickerSectionButton,
  ButtonContentWrapper,
  ButtonContentBorderlessWrapper,
  StoragesWrapper,
}
