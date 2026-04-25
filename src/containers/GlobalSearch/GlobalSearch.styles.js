
import styled from 'styled-components'
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { Input } from '@/components/Input'

const Wrapper = styled.div`
  margin-left: 3rem;
  width: 32.5rem;
  height: 3.2rem;
`

const StyledInput = styled(Input)`
  height: 100%;
`

const StyledSearchIcon = styled(SearchIcon)`
  color: ${(props) => props.theme.color.grayscale4};
`

export {
  Wrapper,
  StyledInput as Input,
  StyledSearchIcon as SearchIcon,
}
