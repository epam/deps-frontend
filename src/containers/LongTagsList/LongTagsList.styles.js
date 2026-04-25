
import styled from 'styled-components'
import { Menu } from '@/components/Menu'
import { Tag } from '@/components/Tag'

const TagsWrapper = styled.div`
  display: flex;
`

const StyledTag = styled(Tag)`
  margin-right: 0.4rem;
  height: 100%;

  &.ant-tag {
    max-width: 28rem;
  }
`

const MenuItem = styled(Menu.Item)`
  padding: 0;
  cursor: default;

  &:hover {
    background-color: unset;
  }
`

const StyledMenu = styled(Menu)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding: 1.6rem;
  width: 32rem;
  max-height: 40rem;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
`

const MoreTagsButton = styled(StyledTag)`
  font-weight: 700;
  gap: 0.5rem;

  &.ant-tag {
    color: ${(props) => props.theme.color.grayscale11};
  }

  &:hover {
    border-color: ${(props) => props.theme.color.grayscale19};
    color: ${(props) => props.theme.color.primary2};
  }
`

export {
  MenuItem,
  StyledMenu as Menu,
  StyledTag as Tag,
  TagsWrapper,
  MoreTagsButton,
}
