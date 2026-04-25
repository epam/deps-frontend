
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { DraggableModal } from './DraggableModal'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}))

const renderHeaderContent = () => <div data-testid="modal-header">Header</div>
const mockChildren = <div data-testid='modal-content'>Modal Content</div>

const mockRenderTrigger = ({ disabled, onClick }) => (
  <button
    data-testid={triggerTestId}
    disabled={disabled}
    onClick={onClick}
  />
)

const triggerTestId = 'custom-trigger'

test('renders trigger', () => {
  render(
    <DraggableModal
      isModalVisible={false}
      renderHeaderContent={renderHeaderContent}
      renderTrigger={mockRenderTrigger}
      toggleModal={jest.fn()}
    >
      {mockChildren}
    </DraggableModal>,
  )

  expect(screen.getByTestId(triggerTestId)).toBeInTheDocument()
})

test('calls toggleModal when trigger is clicked', async () => {
  const mockToggleModal = jest.fn()

  render(
    <DraggableModal
      isModalVisible={false}
      renderHeaderContent={renderHeaderContent}
      renderTrigger={mockRenderTrigger}
      toggleModal={mockToggleModal}
    >
      {mockChildren}
    </DraggableModal>,
  )

  await userEvent.click(screen.getByTestId(triggerTestId))
  expect(mockToggleModal).toHaveBeenCalled()
})

test('renders modal with header and children when visible', () => {
  render(
    <DraggableModal
      isModalVisible={true}
      renderHeaderContent={renderHeaderContent}
      renderTrigger={mockRenderTrigger}
      toggleModal={jest.fn()}
    >
      {mockChildren}
    </DraggableModal>,
  )

  expect(screen.getByTestId('modal-header')).toBeInTheDocument()
  expect(screen.getByTestId('modal-content')).toBeInTheDocument()
})

test('disables trigger when modal is visible', () => {
  render(
    <DraggableModal
      isModalVisible={true}
      renderHeaderContent={renderHeaderContent}
      renderTrigger={mockRenderTrigger}
      toggleModal={jest.fn()}
    >
      {mockChildren}
    </DraggableModal>,
  )

  expect(screen.getByTestId(triggerTestId)).toBeDisabled()
})
