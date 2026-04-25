
import { Document } from 'react-pdf'
import styled from 'styled-components'
import { Slider as SliderComponent } from '@/components/Slider'
import { ScreenBreakpoint } from '@/enums/ScreenBreakpoint'

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

export const ReactPdfDocument = styled(Document)`
  overflow: auto;
`

export const Wrapper = styled.div`
  height: 100%;
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: auto 1fr;
  position: relative;
`

export const Controls = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 0.4rem;
  padding: 0.5rem;
  box-shadow: 0 2px 0.4rem ${(props) => props.theme.color.grayscale1};

  @media (max-width: ${ScreenBreakpoint.laptop}) {
    justify-content: space-around;
    flex-wrap: wrap;
  }
`

export const ControlsSection = styled.div`
  display: flex;
  align-items: center;
`

export const RotationWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const CommandsSeparator = styled.div`
  height: 1.6rem;
  width: 1px;
  margin: 0 0.8rem;
  background-color: ${(props) => props.theme.color.primary5};
`
