
import styled from 'styled-components'

const HintWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem; 
  padding: 1.6rem;
`

const HintItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;

  .ant-badge {
    margin-right: 0.5rem;
  }

`
export {
  HintItem,
  HintWrapper,
}
