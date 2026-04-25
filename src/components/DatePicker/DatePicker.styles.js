
import DatePicker from 'antd/es/date-picker'
import 'antd/lib/date-picker/style/index.less'
import styled, { css } from 'styled-components'

export const StyledDatePicker = styled(DatePicker)`
  display: flex;
  border: none;
  box-shadow: none;
  padding: 0;

  & > div > input {
    display: none;
  }

  & .ant-picker-input {
    cursor: pointer;

    ${({ disabled }) => disabled && css`
      cursor: not-allowed;
  `}
  }

  & .ant-picker-suffix {
    margin: 0;
    color: ${(props) => props.theme.color.grayscale18};
  }
`
