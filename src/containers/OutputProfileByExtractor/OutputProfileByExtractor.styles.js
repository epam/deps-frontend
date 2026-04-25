
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.color.grayscale14};
  border-radius: 0 0 8px 8px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.6rem;
`

const Title = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.4rem;
  color: ${(props) => props.theme.color.grayscale16};
`

export {
  Wrapper,
  Header,
  Title,
}
