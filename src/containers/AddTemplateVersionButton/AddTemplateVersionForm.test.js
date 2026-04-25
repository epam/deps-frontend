
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { FormItem } from '@/components/Form/ReactHookForm'
import { AddTemplateVersionForm } from './AddTemplateVersionForm'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: AddTemplateVersionForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AddTemplateVersionForm />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render description field', () => {
    const descriptionField = wrapper.find(FormItem).props().field.render()
    expect(descriptionField).toMatchSnapshot()
  })
})
