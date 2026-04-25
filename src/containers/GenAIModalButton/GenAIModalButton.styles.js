
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'

const OpenModalButton = styled(Button.Icon)`
  margin-right: 1rem;
  border: none;
  color: ${(props) => props.theme.color.primary2};

  &:hover,
  &:focus {
    border: none;
    box-shadow: none;
  }
`

const CloseIcon = styled(XMarkIcon)`
  cursor: pointer;
`
const Separator = styled.div`
  height: 2.8rem;
  width: 1px;
  margin-right: 1.2rem;
  background-color: ${(props) => props.theme.color.grayscale1Darker};
`

const ModalHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 1.6rem;
  background-color: ${(props) => props.theme.color.grayscale14};
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 8px 8px 0 0;
`

const ModalHeaderCell = styled.div`
  display: flex;
  align-items: center;
`

const ModalTitle = styled.h4`
  font-weight: 600;
  margin-right: 1.2rem;
  margin-bottom: 0;
`

const PageSettingsButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1.2rem;
  color: ${(props) => props.theme.color.primary2};
  background-color: transparent;
  font-weight: 600;
  line-height: 2.2rem;
  border: none;
  box-shadow: none;

  &&:hover,
  &&:focus {
    background-color: transparent;
    border: none;
    box-shadow: none;
    color: ${(props) => props.theme.color.primary2};
  }
`

export {
  OpenModalButton,
  ModalHeaderContainer,
  ModalHeaderCell,
  ModalTitle,
  CloseIcon,
  Separator,
  PageSettingsButton,
}
