
import AntdSwitch from 'antd/es/switch'
import styled, { css } from 'styled-components'
import 'antd/lib/switch/style/index.less'

const StyledSwitch = styled(AntdSwitch)`
  background-color: ${(props) => props.theme.color.grayscale17};

  &.ant-switch-checked {
    background-color: ${(props) => props.theme.color.primary2};
  }

  ${(props) => props.$indeterminate && css`
    background-color: ${(props) => props.theme.color.primary2};

    .ant-switch-handle {
      width: 1.3rem;
      height: 0.3rem;
      background-color: ${(props) => props.theme.color.primary3};
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 1rem;

      &:before {
        display: none;
      }
    }
  `}
`

export {
  StyledSwitch,
}
