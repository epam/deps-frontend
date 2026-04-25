
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Ellipsis } from '@/components/Ellipsis'
import { List } from '@/components/List'

const ListItem = styled(List.Item)`
  display: flex;
  align-items: center;
  width: 28rem;
  height: 4.3rem;
  padding: 0 0 0 1.6rem;
  outline: 1px solid ${(props) => props.theme.color.grayscale21};
  background-color: ${(props) => props.theme.color.grayscale20};
`

const ListMeta = styled(List.Item.Meta)`
  padding-inline: 1rem;

  .ant-list-item-meta-title {
    margin: 0;

    & > span {
      display: flex !important;
    }
  }
`

const DescriptionText = styled(Ellipsis)`
  margin-bottom: 0 !important;
  font-weight: 400;
  line-height: 2rem;
  color: ${(props) => props.theme.color.grayscale13};
`

const IconButton = styled(Button.Icon)`
  color: ${(props) => props.theme.color.grayscale12};
  background-color: transparent;
  border: none;
  height: 100%;
  width: 3.5rem;
  
  &:hover,
  &:active,
  &:focus {
    border: none;
    background-color: transparent;
    box-shadow: none;
  }
`

const IconWrapper = styled.div`
  color: ${(props) => props.theme.color.primary2};
  opacity: ${({ isInProfile }) => isInProfile ? 1 : 0.7};

  & > svg {
    width: 1.6rem;
  }
`

const DragNDropButton = styled(IconButton)`
  cursor: move;
`

export {
  ListItem,
  ListMeta,
  DescriptionText,
  IconButton,
  IconWrapper,
  DragNDropButton,
}
