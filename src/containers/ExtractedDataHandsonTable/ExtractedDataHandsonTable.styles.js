
import styled, { css } from 'styled-components'
import { HandsonTable } from '@/components/HandsonTable'

export const StyledHandsonTable = styled(HandsonTable)`
  overflow: visible !important;

  && td,
  && th {
    color: ${(props) => props.theme.color.grayscale18};
    border-color: ${(props) => props.theme.color.grayscale15} !important;

    ${(props) => props.readOnly && css`
      cursor: not-allowed;
  `}
  }

  thead > tr > th {
    background-color: ${(props) => props.theme.color.grayscale14};
    text-align: left;

    .relative {
      padding: 0.8rem;
    }
  }

  tbody > tr > th {
    background-color: ${(props) => props.theme.color.grayscale14};
    text-align: center;
    vertical-align: middle;
  }

  tbody > tr > td {
    padding: 0.4rem 0.8rem;
  }
`
