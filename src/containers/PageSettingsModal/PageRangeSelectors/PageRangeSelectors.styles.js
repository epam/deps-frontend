
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 1.6rem;
`

const SelectorsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`

const SelectTitle = styled.div`
  margin-bottom: 4px;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale11};
`

const ErrorMessage = styled.div`
  width: 100%;
  height: 4rem;
  margin-top: 1.6rem;
  padding: 9px 1.6rem;
  background-color: ${(props) => props.theme.color.errorBg};
  border: 1px solid ${(props) => props.theme.color.errorLight};
  border-radius: 4px;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2.2rem;
  color: ${(props) => props.theme.color.primary4};
`

export {
  ErrorMessage,
  SelectTitle,
  SelectorsWrapper,
  Wrapper,
}
