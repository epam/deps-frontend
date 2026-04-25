
import styled, { css } from 'styled-components'
import { ComponentSize } from '@/enums/ComponentSize'

const SMALL_LIST = css`
  margin-bottom: 1.5rem;
`

const DocumentsTable = styled.ul`
  ${({ size }) => size === ComponentSize.SMALL && SMALL_LIST}
`

export {
  DocumentsTable,
}
