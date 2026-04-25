
import styled from 'styled-components'
import { PlusCircleIcon } from '@/components/Icons/PlusCircleIcon'

export const ButtonSeparator = styled.div`
  height: 6px;
  width: 2px;
  background-color: ${(props) => props.theme.color.grayscale17};
  margin: 2px 0;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`

export const PlusIcon = styled(PlusCircleIcon)`
  border: none;
  color: ${(props) => props.theme.color.grayscale17};
  font-size: 1.2rem;
  
  &:hover,
  &:focus,
  &:active {
    border: none;
    box-shadow: none;
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    & > div {
      background-color: ${(props) => props.theme.color.primary2};
    }

    & > svg {
      color: ${(props) => props.theme.color.primary2};
    }
  }
`
