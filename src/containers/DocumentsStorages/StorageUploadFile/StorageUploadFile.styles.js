
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { List } from '@/components/List'

const ListItem = styled(List.Item)`
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 4px;
  padding: 0.8rem 1.6rem;
  margin-bottom: 0.8rem;

  &:first-child {
    padding-top: 1rem;
  }
`

const ListMeta = styled(List.Item.Meta)`
  .ant-list-item-meta-avatar {
    margin-right: 1rem;
  }

  .ant-list-item-meta-content {
    max-width: 18rem;
  }

  .ant-list-item-meta-title {
    margin: 0 0 0.5rem;
    line-height: 1.8rem;
    margin-top: -1px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .ant-list-item-meta-description {
    font-size: 1.2rem;
    line-height: 1.4rem;
  }

  .ant-list-item-action {
    padding: 0;
  }
`

const ListContent = styled.div`
  flex: 1 1 auto;
  padding: 0 0.5rem 0.4rem 1.5rem;
`

const FileIcon = styled.div`
  transform: scale(1) translateX(5.5%);
  width: 1.8rem;
  height: 2rem;
`

const StyledButton = styled(Button.Link)`
  font-size: 1.2rem;
  line-height: 1.6rem;
`

const Avatar = styled.div`
  padding: 1rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color.grayscale20};
`

export {
  ListItem,
  ListMeta,
  ListContent,
  FileIcon,
  StyledButton as Button,
  Avatar,
}
