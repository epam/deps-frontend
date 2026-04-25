
import styled from 'styled-components'
import { Button } from '@/components/Button'

const DrawerOpenButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 2.2rem;
  border-radius: 3.2rem;
  border-color: ${(props) => props.theme.color.grayscale19};
  color: ${(props) => props.theme.color.grayscale18};
  background: ${(props) => props.theme.color.grayscale20};
  margin: 0 2rem 0 1rem;
  padding: 1.2rem 2.8rem;

  &:hover {
    color: ${(props) => props.theme.color.grayscale18};
  }
`

const DetailsText = styled.span`
  color: ${(props) => props.theme.color.primary2};
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    color: ${(props) => props.theme.color.borderIcon};
  }
`

const DaysLeftText = styled.span`
  font-weight: 700;
  padding: 0 3rem 0 0.5rem;
`

export {
  DrawerOpenButton,
  DetailsText,
  DaysLeftText,
}
