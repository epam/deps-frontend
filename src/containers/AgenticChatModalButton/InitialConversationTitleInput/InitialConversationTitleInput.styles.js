
import styled from 'styled-components'
import { Input } from '@/components/Input'

const TitleInput = styled(Input)`
  color: ${({ theme }) => theme.color.grayscale22};
  font-weight: 600;
  background-color: ${({ theme }) => theme.color.grayscale14};
`
export {
  TitleInput,
}
