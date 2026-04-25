
import styled from 'styled-components'
import { Grid } from '@/components/Grid'

export const ResizableWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: ${(props) => props.theme.color.primary3};
`

export const Column = styled(Grid.Column)`
  height: 100%;
  max-width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
`

export const RightResizablePage = styled.div`
  width: 100%;
  overflow: hidden;

  & > .ant-col {
    overflow-x: auto;
  }
`

export const PageSeparator = styled.div`
  height: 100%;
  width: 3px;
  cursor: col-resize;
  background-color: ${(props) => props.theme.color.grayscale1};
  border-radius: 4px;
  flex-shrink: 0;
`
