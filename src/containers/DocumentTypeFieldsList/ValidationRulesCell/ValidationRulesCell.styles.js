
import styled from 'styled-components'
import { Tag } from '@/components/Tag'

const Details = styled.div`
  background-color: ${(props) => props.theme.color.grayscale14};
  padding: 1.2rem 1.6rem;
`

const Title = styled.pre`
  padding: 1px 0;
  margin: 0 0 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 2.2rem;
  color: ${(props) => props.theme.color.grayscale18};
`

const Severity = styled.div`
  padding: 1px 0;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale12};
`

const Message = styled.pre`
  padding: 1px 0;
  margin: 8px 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  font-size: 1.2rem;
  line-height: 2rem;
  color: ${(props) => props.theme.color.grayscale18};
`

const Fields = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding: 1.2rem 1.6rem 1.6rem;
`

const TagText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StyledTag = styled(Tag)`
  &.ant-tag {
    max-width: 28rem;
  }
`

const Wrapper = styled.div`
  width: 32rem;
  margin: 0.8rem 0;
  background-color: ${(props) => props.theme.color.primary3};
  border: ${(props) => props.theme.color.grayscale15};
  border-radius: 4px;
  box-shadow: 0 3px 19rem 0 ${(props) => props.theme.color.shadow3};
`

export {
  Details,
  Fields,
  Message,
  TagText,
  Title,
  Severity,
  StyledTag,
  Wrapper,
}
