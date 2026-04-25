
import styled from 'styled-components'
import { IconButton } from '@/components/Button/IconButton'
import { Input } from '@/components/Input'

const MappingKeyWrapper = styled.div`
  width: 15rem;
  display: flex;
  align-items: center;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  margin-right: 0.8rem;
  line-height: 2rem;
`

const MappingKeyInput = styled(Input)`
  color: ${(props) => props.theme.color.grayscale13};
  background-color: ${(props) => props.theme.color.grayscale20};
  border: none;
`

const DeleteIconButton = styled(IconButton)`
  width: 2.5rem;
  height: 3rem;
  cursor: pointer;
  color: ${(props) => props.theme.color.grayscale11};
  background-color: ${(props) => props.theme.color.grayscale20};
  border: none;

  &:active,
  &:focus,
  &:hover {
    border: none;
    box-shadow: none;
  }
`

export {
  DeleteIconButton,
  MappingKeyInput,
  MappingKeyWrapper,
}
