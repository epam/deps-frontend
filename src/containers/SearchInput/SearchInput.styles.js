
import styled from 'styled-components'
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { Input } from '@/components/Input'
import { theme } from '@/theme/theme.default'

const StyledInput = styled(Input)`
  max-width: 32.5rem;

  & > input::-webkit-input-placeholder {
    color: ${theme.color.grayscale1};
  }
`

const StyledSearchIcon = styled(SearchIcon)`
  & > svg {
    fill: ${theme.color.grayscale5};
  }
`

export {
  StyledInput as Input,
  StyledSearchIcon as SearchIcon,
}
