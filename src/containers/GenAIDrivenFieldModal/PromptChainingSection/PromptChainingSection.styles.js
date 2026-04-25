
import styled from 'styled-components'
import { Button } from '@/components/Button'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  padding: 1.6rem 1.6rem 1.6rem 0;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  background-color: ${(props) => props.theme.color.grayscale14};
  min-height: 100%;
`

const NodesWrapper = styled.div`
  min-width: 24.8rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden auto;
  
  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.color.grayscale14};
  }
`

const AddFirstNodeButton = styled(Button.Secondary)`
  width: 20rem;
  height: 4.8rem;
  border-color: ${(props) => props.theme.color.grayscale17};
  background-color: ${(props) => props.theme.color.grayscale14};
  padding: 1.2rem 0;
  color: ${(props) => props.theme.color.grayscale22};
  transition: none;

  svg {
    path {
      fill: ${(props) => props.theme.color.grayscale22};
    }
  }
  
  &:hover,
  &:focus,
  &:active {
    background-color: ${(props) => props.theme.color.grayscale20};
    box-shadow: none;

    svg {
      path {
        fill: ${(props) => props.theme.color.primary2};
      }
    }
  }
`

export {
  Wrapper,
  NodesWrapper,
  AddFirstNodeButton,
}
