
import Slider from 'antd/es/slider'
import 'antd/lib/slider/style/index.less'
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { InputNumber } from '@/components/InputNumber'

export const SliderComponent = styled.div`
  display: flex;
  align-items: center;
`
export const StyledSlider = styled(Slider)`
  width: 4.8rem;
  height: auto;

  .ant-slider-handle {
    height: 0.8rem;
    width: 0.8rem;
    margin-top: -3px;
    background-color: ${(props) => props.theme.color.primary2};
    border: none;
  }

  .ant-slider-rail {
    background-color: ${(props) => props.theme.color.grayscale2};
    height: 2px;
  }

`
export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`
export const SliderButton = styled(Button)`
  color: black;
  line-height: 1;
  font-size: 1.6rem;
  cursor: pointer;
  box-shadow: none;

  :disabled {
    color: ${(props) => props.theme.color.grayscale1Darker};
    background-color: white;
    cursor: default;
  }
`
export const ScaleInputNumber = styled(InputNumber)`
  width: 4.8rem;
  margin-left: 0.8rem;
  
  .ant-input-number-input {
    height: 2.4rem;
    padding: 0 0.8rem;
    font-size: 1.2rem;
    text-align: center;
  }
  
  .ant-input-number-handler-wrap {
    display: none;
  }
`
