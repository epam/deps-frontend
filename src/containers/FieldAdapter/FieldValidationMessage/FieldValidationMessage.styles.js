
import styled from 'styled-components'
import { LongText } from '@/components/LongText'

const Message = styled(LongText)`
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.2rem;

  &:first-letter {
    text-transform: uppercase;
  }
`

const DependentFieldLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
`

export {
  Message,
  DependentFieldLink,
}
