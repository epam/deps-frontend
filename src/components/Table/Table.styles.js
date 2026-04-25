
import Table from 'antd/es/table'
import 'antd/lib/table/style/index.less'
import 'antd/lib/pagination/style/index.less'
import styled, { css } from 'styled-components'

const tableBorder = css`
  border-color: ${(props) => props.theme.color.grayscale15} !important;
`

const itemStyles = css`
  border-color: ${(props) => props.theme.color.grayscale21} !important;
  background-color: ${(props) => props.theme.color.grayscale14} !important;
`

const StyledTable = styled(Table)`
  .ant-table-thead {
    height: 4.8rem;
  }

  .ant-table-header {
    ${tableBorder}
    border-right: 1px solid;
  }

  .ant-table-body {
    overflow-y: auto !important;
  }

  .ant-table-bordered .ant-table-cell {
    ${tableBorder}
  }

  .ant-table-container,
  & table {
    ${tableBorder}
  }

  .ant-table-thead .ant-table-cell {
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 600;
  }

  .ant-table-tbody .ant-table-cell {
    height: 4.8rem;
  }

  .ant-table-selection-column {
    padding: 0;

    .ant-checkbox-wrapper {
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      padding-bottom: 5px;
    }
  }

  .ant-pagination-item,
  .ant-pagination-options-size-changer > .ant-select-selector {
    ${itemStyles}
  }

  .ant-pagination-item-active {
    border-color: ${(props) => props.theme.color.grayscale21} !important;
    background-color: ${(props) => props.theme.color.grayscale21} !important;
  }

  .ant-pagination-item-link {
    color: ${(props) => props.theme.color.primary2};
    ${itemStyles}
  }

  & .ant-spin-nested-loading .ant-spin-spinning {
    max-height: 100%;
  }

  ${(props) => props.onRow && css`
    .ant-table-row {
      cursor: pointer;
    }
  `}
`

export {
  StyledTable,
}
