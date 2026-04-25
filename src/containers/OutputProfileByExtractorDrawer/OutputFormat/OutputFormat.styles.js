
import styled from 'styled-components'

const RadioGroupWrapper = styled.div`
  align-items: start;
  flex-direction: column;
  height: auto;
  margin-right: 1.6rem;
  font-size: 1.4rem;
  font-weight: 600;

  .ant-radio {
    display: none !important;
  }

  .ant-radio-group {
    display: flex;
    flex-wrap: nowrap;
  }

  .ant-radio-wrapper {
    position: relative;
    margin: 0 !important;
    padding: 0.3rem 4.2rem;
    border: 1px solid ${(props) => props.theme.color.grayscale21};
    background-color: ${(props) => props.theme.color.primary3};
    color: ${(props) => props.theme.color.grayscale11};

    :first-child {
      border-radius: 4px 0 0 4px;
    }

    :last-child {
      border-radius: 0 4px 4px 0;
    }
  }

  .ant-radio-wrapper-checked {
    color: ${(props) => props.theme.color.primary2};
    background-color: ${(props) => props.theme.color.grayscale20};
  }
`

export {
  RadioGroupWrapper,
}
