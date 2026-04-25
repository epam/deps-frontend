
import Typography from 'antd/es/typography'
import 'antd/lib/typography/style/index.less'
import styled from 'styled-components'

const { Text } = Typography

const StyledText = styled(Text)`
  & > .ant-input {
    overflow-wrap: normal;
    overflow: hidden;
  }
`

export {
  StyledText,
}
