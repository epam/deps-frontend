
import styled from 'styled-components'
import { Input } from '@/components/Input'

export const TextArea = styled(Input.TextArea)`
  border: none;
  resize: none;

  :focus {
    outline: none;
    box-shadow: none;
  }
`
