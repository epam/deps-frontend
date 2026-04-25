
import styled from 'styled-components'

export const FormWrapper = styled.div`
  & .ant-form-item {
    display: flex;
    flex-direction: column;
    margin: 0;
    
    & > .ant-form-item-label {
      align-self: baseline;
    }
  }
  
  .ant-form-item-label > label {
    font-size: 1.6rem;
  }

  ${({ withoutValidation }) => withoutValidation && `
    & .ant-form-item {
      margin: 0;
    }

    & .ant-form-item:not(:last-child) {
      margin-bottom: 1.6rem;
    }
  `}
`
