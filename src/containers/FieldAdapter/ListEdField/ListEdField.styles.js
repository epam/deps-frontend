
import styled from 'styled-components'
import {
  InfoWrapper,
  FieldWrapper,
} from '@/containers/DocumentField'

const StyledInfoWrapper = styled(InfoWrapper)`
  margin-bottom: 0.8rem;
`

const ListItemWrapper = styled.div`
  margin-bottom: 1.6rem;

  &:last-child {
    margin-bottom: 0;
  }

  ${FieldWrapper} {
    padding: 0;
    border: none;
  }
`

const InfoWrapperCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  & > span {
    line-height: 1rem;
  }
`

export {
  StyledInfoWrapper as InfoWrapper,
  ListItemWrapper,
  InfoWrapperCell,
}
