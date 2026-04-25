
import styled, { css } from 'styled-components'
import { CustomSelect } from '@/components/Select'

const StyledCustomSelect = styled(CustomSelect)`
  width: 100%;

  ${({ $error }) => $error && css`
    .ant-select-selector {
      border: 1px solid ${(props) => props.theme.color.error} !important;

      &:hover,
      &:focus {
        box-shadow: none !important;
        outline: 0;
      }
    }
  `}
`

export {
  StyledCustomSelect as Select,
}
