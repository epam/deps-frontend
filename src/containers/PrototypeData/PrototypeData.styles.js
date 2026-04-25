
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 1.6rem;
  margin-bottom: 2.4rem;
  overflow: hidden;
`

const Column = styled.div`
  display: flex;
  width: ${(props) => props.singleColumn ? '100%' : '50%'};
  background-color: ${(props) => props.theme.color.primary3};
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 4px;
  overflow: hidden;
`

export {
  Wrapper,
  Column,
}
