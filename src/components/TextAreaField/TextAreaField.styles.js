
import styled, { css } from 'styled-components'
import { Input } from '@/components/Input'

export const StyledTextArea = styled(Input.TextArea)`
  width: 100%;
  
  &::placeholder {
    color: ${(props) => props.theme.color.grayscale5};
  }

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  ${({ resizable }) => !resizable && css`
    & .ant-input {
      resize: none;
    }
  `}

  ${({ showCount }) => showCount && css`
    &::after {
      float: none;
      font-size: 1rem;
      color: ${(props) => props.theme.color.grayscale12};
    }
  `}
`
