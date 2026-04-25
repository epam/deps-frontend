
import styled from 'styled-components'

const RadioGroupWrapper = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2rem;

  .ant-radio {
    display: none !important;
  }

  .ant-radio-group {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
  }

  .ant-radio-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 3.2rem;
    position: relative;
    margin: 0 !important;
    border: 1px solid ${(props) => props.theme.color.grayscale21};
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

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale13};
  margin-bottom: 8px;
`

export {
  Label,
  RadioGroupWrapper,
}
