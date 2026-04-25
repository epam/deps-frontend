
import styled from 'styled-components'
import { BookIcon } from '@/components/Icons/BookIcon'

const StyledIcon = styled(BookIcon)`
  color: ${(props) => props.theme.color.primary2};
  width: 2rem;
  height: 2rem;
`

export {
  StyledIcon,
}
