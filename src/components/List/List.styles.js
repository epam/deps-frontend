
import AntdList from 'antd/es/list'
import styled from 'styled-components'

const StyledItem = styled(AntdList.Item)`
  .ant-list-item-action {
    margin-left: 0;

    li:last-child {
      padding-right: 0;
    }
  }
`

export {
  StyledItem,
}
