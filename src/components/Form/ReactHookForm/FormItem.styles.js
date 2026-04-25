
import styled, { css } from 'styled-components'
import { FieldLabel } from '@/components/FieldLabel'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.6rem;

  & > .ant-input[disabled] {
    border: none;
  }

  ${(props) => props.$isCheckmarkField && css`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

    .ant-checkbox-wrapper {
      margin-right: 1.2rem;
    }
  `}

  ${(props) => props.$hasError && css`
    & > .ant-select-selector,
    & > .ant-input {
      border-color: ${(props) => props.theme.color.error} !important;

      &:hover,
      &:focus {
        box-shadow: 0 0 0 2px rgb(255 77 79 / 20%);
        outline: 0;
      }
    }
  `}
`

const StyledFieldLabel = styled(FieldLabel)`
  font-size: 1.2rem;
  line-height: 2.5rem;
  font-weight: 600;
  padding: 0;
  color: ${(props) => props.theme.color.grayscale13};
  text-transform: uppercase;

  span > span > span {
    font-size: 1.4rem;
  }

  ${(props) => props.$isCheckmarkField && css`
    text-transform: capitalize;
  `}
`

const ErrorMessage = styled.div`
  font-size: 1.2rem;
  color: ${(props) => props.theme.color.error};
`

const HintMessage = styled.p`
  padding-top: 0.4rem;
  font-size: 1rem;
  line-height: 1.2rem;
  margin-bottom: 0;
  color: ${(props) => props.theme.color.grayscale12};
`

export {
  Wrapper,
  StyledFieldLabel as FieldLabel,
  ErrorMessage,
  HintMessage,
}
