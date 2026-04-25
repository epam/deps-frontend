
import TimePicker from 'antd/es/time-picker'
import 'antd/lib/time-picker/style/index.less'
import styled from 'styled-components'

export const StyledTimePicker = styled(TimePicker)`
  display: block;
  width: 100%;

  & .anticon-clock-circle:hover {
    cursor: pointer;
  }

  input {
    &::placeholder {
      color: ${(props) => props.theme.color.grayscale5};
    }
  }
`
