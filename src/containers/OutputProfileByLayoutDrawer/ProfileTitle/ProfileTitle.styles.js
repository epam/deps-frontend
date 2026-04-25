
import styled, { css } from 'styled-components'
import { Input } from '@/components/Input'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.6rem 0;
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
`

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale13};
  margin-bottom: 8px;
`

const StyledInput = styled(Input)`
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2.2rem;
  min-width: 100%;
  width: fit-content;
  color: ${(props) => props.theme.color.grayscale18};

  &:hover,
  &:active,
  &:focus {
    box-shadow: none;
  }

  ${(props) => props.$hasError && css`
    border-color: ${props.theme.color.error};
  `}
`

const ValidationError = styled.div`
  font-size: 1.2rem;
  color: ${(props) => props.theme.color.error};
`

export {
  Label,
  Wrapper,
  StyledInput as Input,
  ValidationError,
}
