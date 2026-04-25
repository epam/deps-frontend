
import styled from 'styled-components'
import { SearchInput } from '@/containers/SearchInput'

const Search = styled(SearchInput)`
  margin: 1rem;
  padding-bottom: 0.5rem;
  width: auto;
`

const Wrapper = styled.div`
  background: ${(props) => props.theme.color.grayscale14};
  max-width: 22rem;
`

export {
  Search,
  Wrapper,
}
