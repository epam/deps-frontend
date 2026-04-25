
import styled from 'styled-components'

const EmailAttachmentsWrapper = styled.div`
  border-radius: 4px;  
`

const EmptyContainer = styled.div`
  padding-top: 7rem;
  padding-bottom: 1rem;
  background-color: ${(props) => props.theme.color.primary3};
  margin: 0;
  color: ${(props) => props.theme.color.grayscale5};
  
  .ant-empty-image {
    margin-bottom: 0;
  }
  
  .ant-empty-description {
    max-width: 18rem;
    margin: auto;
    font-size: 1.3rem;
  }
`

export {
  EmailAttachmentsWrapper,
  EmptyContainer,
}
