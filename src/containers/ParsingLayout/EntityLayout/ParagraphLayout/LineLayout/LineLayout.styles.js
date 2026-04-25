
import styled from 'styled-components'
import { Input } from '@/components/Input'
import { theme } from '@/theme/theme.default'

const StyledLineInput = styled(Input)`
  width: calc(100% - 1rem);
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${theme.color.grayscale1};
  border-radius: 4px;
  color: ${theme.color.grayscale5};
  font: inherit;
  outline: none;
`

const LineWrapper = styled.div`
  width: calc(100% - 1rem);
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${theme.color.grayscale1};
  border-radius: 4px;
  color: ${theme.color.grayscale5};
  font: inherit;
  outline: none;
`

export {
  StyledLineInput,
  LineWrapper,
}
