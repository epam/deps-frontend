
import styled from 'styled-components'
import { theme } from '@/theme/theme.default'

const ConfirmContent = styled.p`
  margin: 0;
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 2.2rem;
  color: ${theme.color.grayscale12};
  
  > span {
    font-weight: 600;
    color: ${theme.color.grayscale18};
  }
`

export {
  ConfirmContent,
}
