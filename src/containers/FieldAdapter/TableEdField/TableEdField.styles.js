
import styled, { css } from 'styled-components'

const TableEdFieldWrapper = styled.div`
  padding-right: 0.1px;

  & > .ant-pagination {
    margin: 1rem;
  }
  
  ${(props) => !!props.hasWarnings && css`
    border: 1px solid ${props.theme.color.warning};
  `}

  ${(props) => !!props.hasErrors && css`
    border: 1px solid ${props.theme.color.error};
  `}
`

const InfoWrapperCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-left: auto;
`

export {
  TableEdFieldWrapper,
  InfoWrapperCell,
}
