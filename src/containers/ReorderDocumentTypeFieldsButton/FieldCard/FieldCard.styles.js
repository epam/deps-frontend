
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { List } from '@/components/List'

const ListItem = styled(List.Item)`
  height: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1.2rem 2.4rem;
  outline: 1px solid ${(props) => props.theme.color.grayscale15};
  background-color: ${(props) => props.theme.color.grayscale14};
`

const ListItemMeta = styled(List.Item.Meta)`
  padding-inline: 2rem;

  .ant-list-item-meta-title {
    margin: 0;
    color: ${(props) => props.theme.color.grayscale18};
    font-weight: 600;
    line-height: 2.4rem;
  }
  
  .ant-list-item-meta-description {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${(props) => props.theme.color.grayscale11};
  }
`

const DragAndDropButton = styled(Button.Icon)`
  cursor: move;
  border: none;
  color: ${(props) => props.theme.color.primary2};
  
  &:hover,
  &:active,
  &:focus {
    box-shadow: none;
    border: none;
    cursor: move;
  }
`

const FieldIndex = styled.div`
  padding: 2px 5px;
  border-radius: 4px;
  font-weight: 600;
  background: ${(props) => props.theme.color.grayscale20};
  color: ${(props) => props.theme.color.primary2};
  margin-right: 1.6rem;
`

export {
  ListItem,
  ListItemMeta,
  DragAndDropButton,
  FieldIndex,
}
