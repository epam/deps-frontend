
import { SizeMe } from 'react-sizeme'
import { Canvas } from './Canvas'
import { CanvasViewerContainer } from './ImageViewer.styles'

const ResizableCanvas = (props) => (
  <SizeMe monitorHeight>
    {
      ({ size: { width, height } }) => (
        <CanvasViewerContainer>
          <Canvas
            height={height}
            width={width}
            {...props}
          />
        </CanvasViewerContainer>
      )
    }
  </SizeMe>
)

export {
  ResizableCanvas,
}
