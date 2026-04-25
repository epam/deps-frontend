
import styled from 'styled-components'

const FileTableViewerContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: 5rem 1rem 2rem;
  overflow: hidden;
`

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  padding: 0.5rem;
  box-shadow: 0 0.2rem 0.4rem ${({ theme }) => theme.color.grayscale1};
`

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`

const RightControls = styled.div`
  display: flex;
  align-items: center;
`

const SheetNameStyled = styled.div`
  color: ${({ theme }) => theme.color.primary1Dark};
  font-weight: normal;
  font-size: 1.5rem;
`

export {
  FileTableViewerContainer,
  Controls,
  LeftControls,
  RightControls,
  SheetNameStyled,
}
