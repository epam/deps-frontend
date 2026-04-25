
import styled from 'styled-components'

const FieldsWrapper = styled.div`
  width: 36rem;
  max-height: 100%;
  overflow: auto;
  background-color: ${(props) => props.theme.color.grayscale14};
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.8rem;
  padding: 1.6rem;
`

const BaseFieldsWrapper = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  
  & > div:first-child {
    flex-grow: 1;
  }
`

const Content = styled.div`
  display: flex;
  gap: 1rem;
  height: 100%;
`

export {
  BaseFieldsWrapper,
  FieldsWrapper,
  Content,
}
