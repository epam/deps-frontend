
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 3.4rem;
  font-weight: 600;
  margin-bottom: 1.6rem;
`

const TotalNumberWrapper = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;
`

const Total = styled.div`
  padding: 0.4rem 1.2rem;
  background-color: ${(props) => props.theme.color.grayscale14};
  color: ${(props) => props.theme.color.grayscale18};
  margin-left: 1.2rem;
  border-radius: 4px;
  line-height: 2rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
`

export {
  Wrapper,
  TotalNumberWrapper,
  Total,
}
