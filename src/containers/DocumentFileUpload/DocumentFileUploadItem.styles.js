
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { List } from '@/components/List'

const ListItem = styled(List.Item)`
  align-items: center;
  padding: 0.8rem 1.6rem;

  &:first-child {
    padding-top: 1rem;
  }

  &:last-child {
    padding-bottom: 1rem;
  }
`

const ListMeta = styled(List.Item.Meta)`
  align-items: center;

  .ant-list-item-meta-avatar {
    margin-right: 1rem;
  }

  .ant-list-item-meta-content {
    max-width: 18rem;
  }

  .ant-list-item-meta-title {
    margin: 0;
    line-height: 2.2rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .ant-list-item-meta-description {
    font-size: 1.2rem;
    line-height: 1.4rem;
  }
`

const ListContent = styled.div`
  height: 1.6rem;
`

const FileIcon = styled.div`
  transform: scale(1) translate(2.5%, 15%);
  width: 1.8rem;
  height: 2rem;
`

const LinkButton = styled(Button.Link)`
  font-size: 1.2rem;
  line-height: 1.6rem;
`

export {
  ListItem,
  ListMeta,
  ListContent,
  FileIcon,
  LinkButton,
}
