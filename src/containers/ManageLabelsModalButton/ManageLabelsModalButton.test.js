
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { shallow } from 'enzyme'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { Label } from '@/models/Label'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { ManageLabelsModalButton } from './ManageLabelsModalButton'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

const { WrappedComponent } = ManageLabelsModalButton

describe('Component: ManageLabelsModalButton', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      documentIds: ['test', 'test1'],
      labels: [
        new Label('mockLabelId1', 'mock Label Name 1'),
        new Label('mockLabelId2', 'mock Label Name 2'),
      ],
      addLabel: jest.fn(() => Promise.resolve()),
      createLabel: jest.fn(() => Promise.resolve()),
      fetchLabels: jest.fn(() => Promise.resolve()),
    }
    wrapper = shallow(<WrappedComponent {...defaultProps} />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call props addLabel when calling to handleOk', async () => {
    const [selectedLabel] = defaultProps.labels
    wrapper.setState({ label: selectedLabel._id })
    await wrapper.instance().handleOk()
    expect(defaultProps.addLabel).nthCalledWith(
      1,
      selectedLabel._id,
      defaultProps.documentIds,
    )
  })

  it('should handle empty label state gracefully', async () => {
    wrapper.setState({ label: null })
    await wrapper.instance().handleOk()
    expect(defaultProps.addLabel).not.toHaveBeenCalled()
  })

  it('should call fetchLabels if labels are empty', () => {
    const props = {
      ...defaultProps,
      labels: [],
    }

    wrapper = shallow(<WrappedComponent {...props} />)
    expect(defaultProps.fetchLabels).toHaveBeenCalled()
  })

  it('should not call fetchLabels if labels already exist', () => {
    expect(defaultProps.fetchLabels).not.toHaveBeenCalled()
  })

  it('should call props onSubmit when calling to handleOk and onSubmit prop is defined', async () => {
    const mockOnSubmit = jest.fn()
    const [selectedLabel] = defaultProps.labels
    wrapper.setState({ label: selectedLabel._id })
    wrapper.setProps({
      ...defaultProps,
      onSubmit: mockOnSubmit,
    })
    await wrapper.instance().handleOk()
    expect(mockOnSubmit).nthCalledWith(1, selectedLabel)
    expect(defaultProps.addLabel).not.toHaveBeenCalled()
  })

  it('should call notifySuccess in case of addLabel successfully', async () => {
    const [selectedLabel] = defaultProps.labels
    wrapper.setState({ label: selectedLabel._id })
    await wrapper.instance().handleOk()
    expect(notifySuccess).nthCalledWith(
      1,
      localize(Localization.ADD_LABEL_SUCCESSFUL),
    )
  })

  it('should call notifyWarning in case of addLabel failure', async () => {
    const [selectedLabel] = defaultProps.labels
    wrapper.setState({ label: selectedLabel._id })
    defaultProps.addLabel.mockRejectedValueOnce(new Error('error'))
    await wrapper.instance().handleOk()
    expect(notifyWarning).nthCalledWith(
      1,
      localize(Localization.DEFAULT_ERROR),
    )
  })

  it('should call props createLabel when calling to handleAddNewLabel', async () => {
    const mockNewLabel = new Label('newLabelId', 'testLabel')
    defaultProps.createLabel.mockResolvedValueOnce(mockNewLabel)
    wrapper.setState({ newLabel: mockNewLabel.name })
    await wrapper.instance().handleAddNewLabel()
    expect(defaultProps.createLabel).nthCalledWith(1, mockNewLabel.name)
  })

  it('should call props addLabel after new label creation', async () => {
    const mockNewLabel = new Label('newLabelId', 'testLabel')
    wrapper.setState({ newLabel: mockNewLabel.name })
    defaultProps.createLabel.mockResolvedValueOnce(mockNewLabel)
    await wrapper.instance().handleAddNewLabel()
    expect(defaultProps.addLabel).nthCalledWith(
      1,
      mockNewLabel._id,
      defaultProps.documentIds,
    )
  })

  it('should not call props addLabel if label creation fails', async () => {
    wrapper.setState({ newLabel: 'NewLabel' })
    defaultProps.createLabel.mockRejectedValueOnce(new Error('error'))
    await wrapper.instance().handleAddNewLabel()
    expect(defaultProps.addLabel).not.toHaveBeenCalled()
  })

  it('should call props onSubmit after new label creation and if onSubmit prop is defined', async () => {
    const mockOnSubmit = jest.fn()
    const mockNewLabel = new Label('newLabelId', 'testLabel')
    wrapper.setState({ newLabel: mockNewLabel.name })
    wrapper.setProps({
      ...defaultProps,
      onSubmit: mockOnSubmit,
    })
    defaultProps.createLabel.mockResolvedValueOnce(mockNewLabel)
    await wrapper.instance().handleAddNewLabel()
    expect(mockOnSubmit).nthCalledWith(1, mockNewLabel)
    expect(defaultProps.addLabel).not.toHaveBeenCalled()
  })

  it('should call notifySuccess in case of createLabel successfully', async () => {
    const mockNewLabel = new Label('newLabelId', 'testLabel')
    defaultProps.createLabel.mockResolvedValueOnce(mockNewLabel)
    await wrapper.instance().handleAddNewLabel()
    expect(notifySuccess).nthCalledWith(1, localize(Localization.ADD_LABEL_SUCCESSFUL))
  })

  it('should call notifyWarning in case of createLabel failure', async () => {
    const mockNewLabel = new Label('newLabelId', 'testLabel')
    wrapper.setState({ newLabel: mockNewLabel.name })
    defaultProps.createLabel.mockRejectedValueOnce(new Error('error'))
    await wrapper.instance().handleAddNewLabel()
    expect(notifyWarning).nthCalledWith(
      1,
      localize(Localization.DEFAULT_ERROR),
    )
  })

  it('should render InputlabelGroup with not empty key attribute', () => {
    wrapper.instance().showLabelModal()
    const modalWrapper = wrapper.find(Modal)
    const [newLabelComp] = modalWrapper.props().footer
    expect(newLabelComp.key).not.toBeNull()
  })

  it('shows correct modal title in case title prop is defined', () => {
    const mockModalTitle = 'mockModalTitle'
    wrapper.setProps({
      ...defaultProps,
      title: mockModalTitle,
    })
    wrapper.instance().showLabelModal()
    const modalWrapper = wrapper.find(Modal)
    const modalTitle = modalWrapper.props().title
    expect(modalTitle).toBe(mockModalTitle)
  })
})
