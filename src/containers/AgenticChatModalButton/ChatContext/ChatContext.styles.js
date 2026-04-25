
import styled from 'styled-components'
import { LongTagsList } from '@/containers/LongTagsList'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1.2rem;
  align-items: center;
`

const StyledLongTagsList = styled(LongTagsList)`
  width: calc(100% - 5rem);
  
  .ant-tag {
    border: none;
    background-color: transparent;
    color: ${(props) => props.theme.color.grayscale18};
    font-weight: 400;
    font-size: 1.2rem;
    line-height: 1.6rem;
  }
`

export {
  StyledLongTagsList as LongTagsList,
  Wrapper,
}
