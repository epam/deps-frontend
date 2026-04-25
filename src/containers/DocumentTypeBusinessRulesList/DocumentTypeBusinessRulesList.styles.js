
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  overflow: auto;

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.color.primary5};
  }
`

export {
  CardsWrapper,
  Wrapper,
}
