
import InputNumber from 'antd/es/input-number'
import Slider from 'antd/es/slider'
import styled from 'styled-components'

const StyledSlider = styled(Slider)`
  flex-grow: 1;
  
  .ant-slider-handle {
    border: 4px solid ${(props) => props.theme.color.primary2};
    box-shadow: none;
  }

  .ant-slider-rail {
    background-color: ${(props) => props.theme.color.primary3};
    border: 1px solid ${(props) => props.theme.color.grayscale15};
  }

  .ant-slider-track {
    background-color: ${(props) => props.theme.color.primary2};
  }

  .ant-slider-dot {
    width: 4px;
    height: 8px;
    border-radius: 4px;
    background-color: ${(props) => props.theme.color.grayscale17};
  }

  .ant-slider-dot-active {
    background-color: ${(props) => props.theme.color.primary2};
    border-color: ${(props) => props.theme.color.primary2};
  }
  
  &:hover {
    .ant-slider-rail {
      background-color: ${(props) => props.theme.color.primary3};
    }

    .ant-slider-handle {
      border-color: ${(props) => props.theme.color.primary2};
    }

    .ant-slider-handle:not(.ant-tooltip-open) {
      border-color: ${(props) => props.theme.color.primary2};
    }

    .ant-slider-track {
      background-color: ${(props) => props.theme.color.primary2};
    }
  }
`

const StyledInputNumber = styled(InputNumber)`
  width: 5.2rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 4px;
  color: ${(props) => props.theme.color.grayscale18};
`

const Wrapper = styled.div`
  display: flex;
  gap: 4px;
`

export {
  StyledInputNumber as InputNumber,
  StyledSlider as Slider,
  Wrapper,
}
