
import styled from 'styled-components'
import { LongLabelsList } from '@/containers/LongLabelsList'

const Wrapper = styled.div`
  margin-bottom: 1.6rem;
  border-radius: 0.8rem;
`

const Header = styled.div`
  max-height: 8rem;
  background: ${(props) => props.theme.color.primary3};
  display: flex;
  gap: 1.6rem;
  align-items: center;
  padding: 1.6rem;
`

const CommandsSeparator = styled.div`
  height: 3.2rem;
  width: 0.1rem;
  background-color: ${(props) => props.theme.color.grayscale15};
`

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  flex-grow: 1;
`

const StyledLongLabelsList = styled(LongLabelsList)`
  width: 30%;
  justify-content: flex-end;
`

export {
  Header,
  CommandsSeparator,
  InfoWrapper,
  Wrapper,
  StyledLongLabelsList as LongLabelsList,
}
