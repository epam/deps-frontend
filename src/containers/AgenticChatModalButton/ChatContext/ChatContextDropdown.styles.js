
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { CheckIcon } from '@/components/Icons/CheckIcon'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'
import { List } from '@/components/List'

const StyledButton = styled(Button)`
  width: 3.7rem;
  height: 2.8rem;
  padding: 0.4rem 1.2rem;
  background-color: ${(props) => props.theme.color.grayscale20};
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.color.grayscale15};

  &:hover,
  &:active,
  &:focus {
    background-color: ${(props) => props.theme.color.grayscale21};
    border: 1px solid ${(props) => props.theme.color.grayscale15};
  }
`

const StyledPlusIcon = styled(NewPlusIcon)`
  path {
    fill: ${(props) => props.theme.color.grayscale12};
  }
`

const StyledList = styled(List)`
  width: 25.5rem;
  max-height: 20rem;
  overflow-y: auto;
  background-color: ${(props) => props.theme.color.primary3};
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 4px;
  box-shadow: 0 0.3rem 1.9rem 0 ${(props) => props.theme.color.shadow3};

  &::-webkit-scrollbar {
    width: 0.6rem;
  }
`

const StyledListItem = styled(List.Item)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 4rem;
  gap: 0.4rem;
  padding: 0.8rem 1.2rem;
  background-color: ${(props) => props.theme.color.primary3};
  
  && {
    border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
  }

  &:hover {
    background-color: ${(props) => props.theme.color.grayscale20};
    cursor: pointer;
  }
`

const StyledCheckIcon = styled(CheckIcon)`
  path {
    fill: ${(props) => props.theme.color.grayscale12};
  }
`

export {
  StyledButton as Button,
  StyledCheckIcon as CheckIcon,
  StyledList as List,
  StyledListItem as ListItem,
  StyledPlusIcon as PlusIcon,
}
