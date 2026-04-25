
import styled from 'styled-components'
import { Tag } from '@/components/Tag'

const StyledTag = styled(Tag)`
  background: #fff;
  border-style: dashed;
`

const Text = styled.span`
  display: inline-block;
  max-width: 10rem;
  line-height: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export {
  StyledTag,
  Text,
}
