
import styled from 'styled-components'
import { Input } from '@/components/Input'

const StyledInput = styled(Input)`
  width: 24rem;
  height: 3.2rem;

  & > .ant-input-prefix { 
    margin-right: 1rem;
  }
`

export {
  StyledInput,
}
