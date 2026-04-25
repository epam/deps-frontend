
import AntdInput from 'antd/es/input'
import styled from 'styled-components'
import 'antd/lib/input/style/index.less'
import { theme } from '@/theme/theme.default'

export const StyledInput = styled(AntdInput)`
  &::placeholder {
    color: ${theme.color.grayscale22};
    font-weight: 400;
  }
`
