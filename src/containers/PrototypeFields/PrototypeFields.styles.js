
import styled from 'styled-components'
import { Button } from '@/components/Button'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  max-height: 6.5rem;
  padding: 0 1.6rem;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.color.grayscale14};
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};

  & > button {
    margin-bottom: 0;
  }
`

const Title = styled.h4`
  min-width: 8rem;
  margin: 0;
  font-weight: 600;
  line-height: 2.4rem;
`

const FieldsListWrapper = styled.div`
  display: grid;
  gap: 1.6rem;
  grid-auto-rows: 11rem;
  height: 100%;
  padding: 1.6rem;
  overflow: auto;
  grid-template-columns: ${(props) => `repeat(${props.fieldsColumnsCount}, 1fr)`};
`

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  align-self: center;

  & > svg {
    margin-right: 1rem;
  }
`

const Controls = styled.div`
  display: flex;
  gap: 1.6rem;
`

export {
  Wrapper,
  Header,
  Title,
  FieldsListWrapper,
  StyledButton as Button,
  Controls,
}
