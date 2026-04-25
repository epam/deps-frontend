
import styled from 'styled-components'

const Header = styled.div`
  margin-bottom: 3rem;
  font-size: 3rem;
`

const Item = styled.div`
  display: inline-block;
  margin: 0 1rem 0 0;

  &:last-child {
    margin-right: 0
  }
`

Header.Item = Item

export {
  Header,
}
