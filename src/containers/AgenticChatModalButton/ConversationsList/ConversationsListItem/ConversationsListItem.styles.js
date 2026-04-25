
import styled from 'styled-components'
import { List } from '@/components/List'

const StyledListItem = styled(List.Item)`
  background-color: ${({ $isActive, theme }) => $isActive && theme.color.grayscale20};
  border: none !important;
  border-radius: 0.8rem;
  color: ${(props) => props.theme.color.grayscale18};
  font-weight: ${({ $isActive }) => $isActive ? 600 : 400};
  margin: 0 0 1.6rem 2.4rem;
  padding: 5px 1.2rem;
  cursor: pointer;
`

export {
  StyledListItem as ListItem,
}
