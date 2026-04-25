
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem;
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale21};
`

const Controls = styled.div`
  display: flex;
  align-items: center;
`

const Label = styled.label`
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale12};
  margin-right: 1.2rem;
`

const ValidationSwitch = styled.div`
  display: flex;
  margin-right: 1.6rem;
`

export {
  Wrapper,
  Controls,
  Label,
  ValidationSwitch,
}
