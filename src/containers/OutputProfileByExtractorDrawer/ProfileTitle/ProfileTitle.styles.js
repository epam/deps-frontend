
import styled, { css } from 'styled-components'
import { Input } from '@/components/Input'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StyledInput = styled(Input)`
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.2rem;
  min-width: 32rem;
  width: fit-content;
  margin: 0.5rem 0;
  color: ${(props) => props.theme.color.grayscale16};

  &::placeholder {
    font-size: 1.4rem;
    font-weight: 400;
  }

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
  Wrapper,
  StyledInput as Input,
  ValidationError,
}
