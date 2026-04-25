
import AntdRadio from 'antd/es/radio'
import styled from 'styled-components'

const StyledRadioGroup = styled(AntdRadio.Group)`
  .ant-radio-wrapper {
    color: ${(props) => props.theme.color.grayscale18};
  }

  .ant-radio {
    .ant-radio-inner {
      border-color: ${(props) => props.theme.color.primary2};
      box-shadow: none;
    }

    &-checked {
      .ant-radio-inner:after {
        background-color: ${(props) => props.theme.color.primary2};
        border-color: ${(props) => props.theme.color.primary2};
      }
    }
    
    &-disabled {
      .ant-radio-inner {
        background-color: ${(props) => props.theme.color.primary3};
        border-color: ${(props) => props.theme.color.grayscale22} !important;
      }

      .ant-radio-inner:after {
        background-color: ${(props) => props.theme.color.grayscale22};
        border-color: ${(props) => props.theme.color.grayscale22};
      }
      
      & + span {
        color: ${(props) => props.theme.color.grayscale22};
      }
    }
  }
`

export {
  StyledRadioGroup,
}
