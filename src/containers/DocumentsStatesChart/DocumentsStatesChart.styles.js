
import styled from 'styled-components'

const ChartWrapper = styled.div`
  width: clamp(35rem, 100%, 70rem);
  padding: 1.6rem 2.4rem 4.5rem;
  border: 1px solid ${(props) => props.theme.color.grayscale21};
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.grayscale14};
  margin-left: auto;
`

const ChartTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 3.2rem;
  margin-bottom: 3.2rem;
  color: ${(props) => props.theme.color.grayscale16};
`

const ContentWrapper = styled.div`
  display: flex;

  & .ant-list {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`

const DiagramWrapper = styled.div`
  height: min(11vw, 21rem);
  width: clamp(14rem, 10vw, 20rem);
`

export {
  ChartWrapper,
  ChartTitle,
  ContentWrapper,
  DiagramWrapper,
}
