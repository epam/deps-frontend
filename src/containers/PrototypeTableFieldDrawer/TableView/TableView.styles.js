
import styled from 'styled-components'
import { Table } from '@/components/Table'

const StyledTable = styled(Table)`
  .ant-table-thead .ant-table-cell {
    padding: 1rem;
  }
  
  .ant-table-thead th {
    background-color: ${(props) => props.theme.color.primary3};
  }

  .highlighted,
  .highlighted .ant-table-cell {
    background-color: ${(props) => props.theme.color.grayscale20} !important;
  }

  .ant-table-cell.header-row {
    background: ${(props) => props.theme.color.grayscale14};
  }
`

const Wrapper = styled.div`
  width: 100%;
  overflow: auto;
`

export {
  StyledTable as Table,
  Wrapper,
}
