
import styled from 'styled-components'
import { ProfileFieldCard } from '../ProfileFieldCard'

const EmptyResultWrapper = styled.div`
  width: 24rem;
  height: 15rem;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 4px;
  background: ${(props) => props.theme.color.primary3};
`

const ListWrapper = styled.div`
  width: 100%;
  max-height: 22rem;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 4px;
  background: ${(props) => props.theme.color.primary3};
  overflow-y: auto;
  box-shadow: 0 3px 19px 0 ${(props) => props.theme.color.shadow2};
`

const StyledProfileFieldCard = styled(ProfileFieldCard)`
  background: transparent;
  width: 24rem;
  outline: 1px solid ${(props) => props.theme.color.grayscale1};
  
  &:hover {
    background: ${(props) => props.theme.color.grayscale20};
  }
`

export {
  ListWrapper,
  EmptyResultWrapper,
  StyledProfileFieldCard,
}
