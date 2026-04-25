
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 0.8rem 0;
  height: 100%;

  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
`

const Controls = styled.div`
  display: flex;
  gap: 1.6rem;
  justify-content: end;
  padding: 0 1.6rem;
`

export {
  Wrapper,
  Controls,
}
