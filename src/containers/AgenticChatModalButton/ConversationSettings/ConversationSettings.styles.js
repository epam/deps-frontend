
import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1.2rem;
  align-items: center;
  margin-bottom: 1.2rem;
  position: relative;
`

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 1.2rem;
`

const Separator = styled.div`
  height: 2.4rem;
  width: 1px;
  background-color: ${(props) => props.theme.color.grayscale15};
`

export {
  ButtonsWrapper,
  Separator,
  Wrapper,
}
