
import styled from 'styled-components'
import { FormItem as FormItemComponent } from '@/components/Form'
import { AngleDownIcon as AngleDownIconComponent } from '@/components/Icons/AngleDownIcon'
import { TrashIcon as TrashIconComponent } from '@/components/Icons/TrashIcon'
import { LongText as LongTextComponent } from '@/components/LongText'

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`

export const HeaderTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.primary4};
`

export const FileCardWrapper = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 1.6rem;
  border-radius: 0.8rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  padding: 1.6rem;
  background-color: ${(props) => props.theme.color.primary3};
  border-color: ${(props) => (props.$isOpen ? props.theme.color.primary2 : props.theme.color.grayscale15)};
`

export const LongText = styled(LongTextComponent)`
  justify-self: start;
  max-width: 100%;
  font-size: 1.4rem;
  line-height: 2.2rem;
  color: ${(props) => props.theme.color.primary4};
`

export const TrashIcon = styled(TrashIconComponent)`
  color: ${(props) => props.theme.color.grayscale12};
  margin-left: auto;

  &:hover,
  &:active {
    color: ${(props) => props.theme.color.grayscale19};
  }
`

export const FormItem = styled(FormItemComponent)`
  margin-bottom: 0;
`

export const CardHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  grid-gap: 1.3rem;
  cursor: pointer;
`

export const Section = styled.section`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1.6rem;
  grid-auto-columns: 1fr;
  margin-top: 1.6rem;
`

export const AngleDownIcon = styled(AngleDownIconComponent)`
  transition: transform 0.2s;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'none')};

  &:hover {
    color: ${(props) => props.theme.color.primary2};
  }
`

export const DisclaimerText = styled.div`
  font-size: 1em;
  color: ${(props) => props.theme.color.grayscale18};
`

export const FileCardNameWrapper = styled.div`
  display: grid;
  grid-gap: 0.2rem;
`

export const FileSettingsWrapper = styled.div`
  display: ${({ $isVisible }) => $isVisible ? 'grid' : 'none'};
  grid-template-columns: 100%;
  grid-gap: 1.2rem;
`
