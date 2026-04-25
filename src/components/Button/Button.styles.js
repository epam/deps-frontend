
import AntdButton from 'antd/es/button'
import 'antd/lib/button/style/index.less'
import styled from 'styled-components'

const StyledButton = styled(AntdButton)`
  &.ant-btn-primary:hover {
    background: ${(props) => props.theme.color.primary2};
    box-shadow: 0 0.4rem 1rem ${(props) => props.theme.color.primary2Light};
  }
  
  &.ant-btn-primary:active, &.ant-btn-primary:focus {
    background: ${(props) => props.theme.color.primary2Darker};
  }
  
  &.ant-btn-primary[disabled] {
    background: ${(props) => props.theme.color.primary2};
    color: ${(props) => props.theme.color.primary3};
    opacity: 0.3;
  }
  
  &.ant-btn-primary[disabled]:hover {
    background: ${(props) => props.theme.color.primary2};
    color: ${(props) => props.theme.color.primary3};
  }
  
  &.ant-btn-ghost {
    font-weight: 600;
    color: ${(props) => props.theme.color.primary2};
    border-color: ${(props) => props.theme.color.primary2};

    &:hover {
      background: ${(props) => props.theme.color.grayscale2};
    }

    &:active {
      background: ${(props) => props.theme.color.grayscale7};
    }

    &[disabled] {
      color: ${(props) => props.theme.color.primary2};
      border-color: ${(props) => props.theme.color.primary2};
      opacity: 0.3;
      background: ${(props) => props.theme.color.primary3};
    }
  }
  
  &.ant-btn-icon-only {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export {
  StyledButton,
}
