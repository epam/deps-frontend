
import styled from 'styled-components'

const FormatBadge = styled.div`
  padding: 0.6rem 1.2rem;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2rem;
  text-transform: capitalize;
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.grayscale20};
  color: ${(props) => props.theme.color.primary2};
`

const Label = styled.label`
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale12};
  margin-right: 1.2rem;
`

export {
  FormatBadge,
  Label,
}
