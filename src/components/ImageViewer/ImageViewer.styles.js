
import styled from 'styled-components'
import { Slider as SliderComponent } from '@/components/Slider'

export const Slider = styled(SliderComponent)`
  .ant-btn-circle {
    border: none;
    min-width: 2.5rem;
    min-height: 2rem;
    width: auto;
    height: auto;
    font-size: 2rem;

    &::after {
      animation: 0s;
    }
  }
`

export const CanvasViewerContainer = styled.div`
  flex-grow: 1;
  overflow: hidden;
`

export const ImageViewerContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  & .ant-spin-nested-loading .ant-spin-spinning {
    max-height: 100%;
  }

  .anticon {
    font-size: 1.5rem;
  }
`

export const ImgWrapper = styled.div`
  position: relative;
  min-height: 40rem;
`

export const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  padding: 0.5rem;
  box-shadow: 0 2px 0.4rem ${(props) => props.theme.color.grayscale1};

  @media (max-width: 1250px) {
    justify-content: space-around;
    flex-wrap: wrap;
  }
`

export const LeftControls = styled.div`
  display: flex;
  align-items: center;
`

export const RightControls = styled.div`
  display: flex;
  align-items: center;
`

export const RelativeWrapper = styled.div`
  position: relative;
`

export const NoData = styled.div`
  text-align: center;
  font-size: 300%;
  color: ${(props) => props.theme.color.grayscale1Darker};
  position: absolute;
  left: 0;
  right: 0;
  top: 15rem;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const CommandsSeparator = styled.div`
  height: 1.6rem;
  width: 1px;
  margin: 0 0.8rem;
  background-color: ${(props) => props.theme.color.primary5};
`
