
import styled, { css } from 'styled-components'
import { List } from '@/components/List'

const StyledList = styled(List)`
  max-height: 23rem;
  margin-top: 0.8rem;
  overflow-y: auto;
`

const ListItem = styled(List.Item)`
  cursor: pointer;
  
  ${(props) => props.disabled && css`
    color: ${(props) => props.theme.color.grayscale1};
    cursor: not-allowed;
  `}
  
  ${(props) => props.$active && css`
    font-weight: bold;
  `}
`

export {
  StyledList as List,
  ListItem,
}
