
import styled from 'styled-components'

export const DocumentTableViewerContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: 5rem 1rem 2rem;
  overflow: hidden;
`
export const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  padding: 0.5rem;
  box-shadow: 0 2px 0.4rem ${(props) => props.theme.color.grayscale1};
`

export const LeftControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`

export const RightControls = styled.div`
  display: flex;
  align-items: center;
`

export const SheetNameStyled = styled.div`
  color: ${(props) => props.theme.color.primary1Dark};
  font-weight: normal;
  font-size: 1.5rem;
`
