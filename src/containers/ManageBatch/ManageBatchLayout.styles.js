
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer as DrawerComponent } from '@/components/Drawer'
import { FormItem as FormItemComponent, Form as FormComponent } from '@/components/Form'

export const Drawer = styled(DrawerComponent)`
  z-index: 1001;

  .ant-drawer-title {
    color: ${(props) => props.theme.color.grayscale18};
  }

  .ant-drawer-footer {
    padding: 1rem 2.4rem;
  }
`

export const DrawerFooterWrapper = styled.div`
  display: flex;
  gap: 1.6rem;
`

export const FormItem = styled(FormItemComponent)`
  margin: 0;
`

export const BatchUploadFormItem = styled(FormItem)`
  height: 100%;
  overflow: hidden;
`

export const Section = styled.section`
  display: grid;
  padding: 1.5rem;
  grid-gap: 1.6rem;
  grid-template-columns: 100%;
  border: 1px solid ${({ theme }) => theme.color.grayscale15};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.color.grayscale14};
`

export const Form = styled(FormComponent)`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 2.4rem;
`

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  height: 100%;
  flex-basis: 50%;
  width: calc(50% - 2.4rem);
  overflow: auto;
`

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 50%;
  height: 100%;
  border-radius: 0.4rem;
  width: calc(50% - 2.4rem);
`

export const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.grayscale18};
  line-height: 1.2rem;
  text-transform: uppercase;
`

export const ResetButton = styled(Button.Text)`
  width: auto;
  color: ${(props) => props.theme.color.primary2};
`

export const CancelButton = styled(Button.Secondary)`
  margin-left: auto;
`
