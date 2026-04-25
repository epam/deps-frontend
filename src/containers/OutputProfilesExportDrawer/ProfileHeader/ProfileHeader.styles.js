
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.3rem 1.6rem;
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale21};
`

const Description = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
`

const Title = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.4rem;
  margin-bottom: 0;
`

const DateWrapper = styled.p`
  font-size: 1rem;
  margin-bottom: 0;
`

const Date = styled.span`
  font-weight: 700;
  padding-inline: 0.5rem;
`

const Label = styled.label`
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale12};
  margin-right: 1.2rem;
  margin-left: 1.6rem;
`

export {
  Wrapper,
  Description,
  Title,
  Controls,
  DateWrapper,
  Date,
  Label,
}
