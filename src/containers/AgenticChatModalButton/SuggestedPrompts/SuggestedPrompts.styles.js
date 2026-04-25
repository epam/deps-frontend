
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 1.6rem;
`

const Title = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2rem;
`

const List = styled.ul`
  border: 1px solid ${({ theme }) => theme.color.grayscale15};
  border-radius: 8px;
  list-style: inside;
  background-color: ${({ theme }) => theme.color.primary3};
`

const PromptItem = styled.li`
  border-bottom: 1px solid ${({ theme }) => theme.color.grayscale15};
  padding: 1.2rem 1.6rem;
  color: ${({ theme }) => theme.color.grayscale18};
  cursor: pointer;
    
  &:last-child {
    border-bottom: none;
  }

  &:hover,
  &:focus-visible {
    background-color: ${({ theme }) => theme.color.grayscale20};
    color: ${({ theme }) => theme.color.primary2};
  }
`

export {
  List,
  PromptItem,
  Title,
  Wrapper,
}
