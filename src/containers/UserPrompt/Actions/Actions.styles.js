
import styled from 'styled-components'
import { IconButton } from '@/components/Button/IconButton'

const ActionIcon = styled(IconButton)`
  width: 2.4rem;
  height: 2.4rem;
  cursor: pointer;
  color: ${(props) => props.theme.color.primary2};
  border: none;

  &:active,
  &:focus,
  &:hover {
    border: none;
    box-shadow: none;
    background-color: ${(props) => props.theme.color.primary3};
  }
`

const Wrapper = styled.div`
  position: absolute;
  top: -0.6rem;
  right: 3rem;
  display: flex;
  gap: 1rem;
  border-radius: 3.2rem;
  padding: 0.4rem 1.5rem;
  background-color: ${(props) => props.theme.color.primary3};
`

export {
  ActionIcon,
  Wrapper,
}
