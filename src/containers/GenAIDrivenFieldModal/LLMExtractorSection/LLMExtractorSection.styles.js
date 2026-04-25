
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { FaRotateIcon } from '@/components/Icons/FaRotateIcon'

const ExtractorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 8.4rem; 
  border-radius: 8px;
  gap: 1.2rem;
  padding: 1.6rem;
  background-color: ${(props) => props.theme.color.grayscale14};
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  height: 2.4rem;
`

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.2rem;
  text-transform: uppercase;
  color: ${(props) => props.theme.color.grayscale13};
`

const ChangeButton = styled(Button)`
  height: 2.4rem;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: ${(props) => props.theme.color.grayscale18};
  border: none;
  box-shadow: none;

  &&:hover,
  &&:focus {
    border: none;
    box-shadow: none;
    color: ${(props) => props.theme.color.grayscale18};
  }
`

const StyledFaRotateIcon = styled(FaRotateIcon)`
  color: ${(props) => props.theme.color.grayscale12};
`

export {
  ChangeButton,
  ExtractorWrapper,
  SectionHeader,
  SectionTitle,
  StyledFaRotateIcon as RotateIcon,
}
