
import styled, { css } from 'styled-components'
import { IconButton } from '@/components/Button/IconButton'
import { Input } from '@/components/Input'

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.color.grayscale14};
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 8px;
  padding: 1.6rem;

  ${(props) => props.$isActive && css`
    &:hover {
      cursor: pointer;
      border: 1px solid ${(props) => props.theme.color.primary2};
    }
  `}
`

const FirstRowWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 1.2rem;
`

const NameInput = styled(Input)`
  font-weight: 600;
  line-height: 2.2rem;
  color: ${(props) => props.theme.color.grayscale18};
  margin-right: 1.6rem;
  
  .ant-input-suffix {
    color: ${(props) => props.theme.color.grayscale22};
    font-size: 1.2rem;
    font-weight: 600;
    text-transform: capitalize;
  }
`

const DeleteIconButton = styled(IconButton)`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  color: ${(props) => props.theme.color.grayscale11};
  border: none;
  margin-left: 1.6rem;

  &:active,
  &:focus,
  &:hover {
    border: none;
    box-shadow: none;
  }
`

const SecondRowWrapper = styled.div`
  display: flex;
  align-items: center;
`

export {
  Wrapper,
  FirstRowWrapper,
  NameInput,
  DeleteIconButton,
  SecondRowWrapper,
}
