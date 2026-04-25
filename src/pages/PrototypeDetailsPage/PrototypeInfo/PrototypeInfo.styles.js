
import styled from 'styled-components'
import { FieldLabel } from '@/components/FieldLabel'

const FieldsWrapper = styled.div`
  flex-grow: 1;
  display: grid;
  grid-gap: 1.6rem;
  grid-template-columns: 25% 25% minmax(0, 1fr);
`

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.4rem;
`

const ReadonlyField = styled.div`
  height: 3.2rem;
  padding: 0 1.1rem;
  display: flex;
  align-items: center;
  font-weight: 400;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 4px;
  background: ${(props) => props.theme.color.grayscale20};
  color: ${(props) => props.theme.color.grayscale13};
`

const StyledFieldLabel = styled(FieldLabel)`
  font-size: 1.2rem;
  line-height: 2.5rem;
  font-weight: 600;
  padding: 0;
  color: ${(props) => props.theme.color.grayscale13};

  span > span > span {
    font-size: 1.4rem;
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`

export {
  FieldsWrapper,
  ReadonlyField,
  FieldWrapper,
  StyledFieldLabel as FieldLabel,
  Wrapper,
}
