
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { LongText } from '@/components/LongText'
import { theme } from '@/theme/theme.default'

const Wrapper = styled.div`
  position: relative;
  width: 20rem;
  min-height: 4.8rem;
  margin: 0.8rem 0;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.color.grayscale17};
  background: ${theme.color.grayscale14};
  border-radius: 4px;
  color: ${theme.color.grayscale16};
  font-weight: 600;
  cursor: pointer;
  user-select: none;

  &:hover {
    border-color: ${theme.color.primary2};
  }

  ${({ $isActive }) => $isActive && css`
    background-color: ${theme.color.grayscale20};
    border-color: ${(props) => props.theme.color.primary2};
  `}
`

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.color.error};
  font-size: 1rem;
  font-weight: 400;
`

const DeleteButton = styled(Button.Icon)`
  position: absolute;
  font-size: 1rem;
  width: 2.4rem;
  height: 2.4rem;
  top: -1.2rem;
  right: -1.2rem;
  background: ${(props) => props.theme.color.primary3};
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.color.primary2};
  color: ${(props) => props.theme.color.primary2};
`

const NameInput = styled(Input)`
  border: none;
  font-weight: 600;
  background: ${(props) => props.theme.color.primary3};
  padding: 0 4px;
  margin: 2px 0;
  width: ${(props) => props.$width};
  max-width: 100%;
  
  &:focus {
    box-shadow: none;
  }
`

const Name = styled(LongText)`
  max-width: 100%;
`

const HiddenText = styled.span`
  position: absolute;
  visibility: hidden;
  white-space: pre;
  font-size: 1.4rem;
`

export {
  Wrapper,
  ErrorMessage,
  DeleteButton,
  NameInput,
  Name,
  HiddenText,
}
