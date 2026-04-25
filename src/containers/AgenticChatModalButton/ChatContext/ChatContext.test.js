
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFetchModeQuery } from '@/apiRTK/agenticAiApi'
import { AgenticAiModes } from '@/enums/AgenticAiModes'
import { AgenticAiParameters } from '@/enums/AgenticAiParameters'
import { Localization, localize } from '@/localization/i18n'
import {
  Mode,
  Tool,
  ToolParameter,
  ToolSet,
} from '@/models/AgenticChat'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { ChatContext } from './ChatContext'

jest.mock('@/apiRTK/agenticAiApi', () => ({
  useFetchModeQuery: jest.fn(() => ({
    data: [mockMode],
    isFetching: false,
    isError: false,
  })),
}))

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/LayerGroupIcon', () => ({
  LayerGroupIcon: () => <span data-testid='group-icon' />,
}))

jest.mock('@/containers/LongTagsList', () => ({
  LongTagsList: jest.fn(({ tags, onTagClose }) => (
    <div data-testid='tags-list'>
      {
        tags.map((tag) => (
          <div key={tag.id}>
            {tag.text}
            <button
              data-testid='close-button'
              onClick={() => onTagClose(tag)}
            />
          </div>
        ))
      }
    </div>
  )),
}))

jest.mock('./ChatContextDropdown', () => ({
  ChatContextDropdown: ({ disabled, onToolSelect, toolsList }) => (
    <div>
      <button
        data-testid='dropdown-trigger-button'
        disabled={disabled}
      />
      <ul>
        {
          toolsList.map((tool) => (
            <li
              key={tool.id}
              onClick={onToolSelect}
            >
              {tool.name}
              <input
                checked={tool.isSelected}
                readOnly={true}
                type='checkbox'
              />
            </li>
          ))
        }
      </ul>
    </div>
  ),
}))

jest.mock('../hooks', () => ({
  useChatSettings: jest.fn(() => ({
    selectedToolIds: [mockToolId1],
    setSelectedToolIds: mockSetSelectedToolIds,
    toolsById: mockToolsById,
    setToolsById: mockSetToolsById,
  })),
}))

const mockSetSelectedToolIds = jest.fn()
const mockSetToolsById = jest.fn()

const mockTool1 = new Tool({
  code: 'mockTool1',
  name: 'Tool 1',
  parameters: [new ToolParameter({ name: AgenticAiParameters.DOCUMENT_ID })],
})

const mockTool2 = new Tool({
  code: 'mockTool2',
  name: 'Tool 2',
  parameters: [new ToolParameter({ name: AgenticAiParameters.DOCUMENT_TYPE_ID })],
})

const mockToolSet = new ToolSet({
  id: 'id',
  code: 'toolSetCode1',
  name: 'ToolSet 1',
  tools: [mockTool1, mockTool2],
})

const mockMode = new Mode({
  code: AgenticAiModes.DOCUMENT,
  id: 'modeId',
  toolSets: [mockToolSet],
})

const mockToolId1 = `${mockToolSet.code}-${mockTool1.code}`
const mockToolId2 = `${mockToolSet.code}-${mockTool2.code}`

const mockToolsById = {
  [mockToolId1]: {
    ...mockTool1,
    id: mockToolId1,
    toolSetCode: mockToolSet.code,
  },
  [mockToolId2]: {
    ...mockTool2,
    id: mockToolId2,
    toolSetCode: mockToolSet.code,
  },
}

test('shows loading spinner when fetching', () => {
  useFetchModeQuery.mockImplementationOnce(() => ({
    data: [],
    isFetching: true,
    isError: false,
  }))

  render(<ChatContext disabled={false} />)

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows notification message in case of Tool Sets fetching failure', () => {
  useFetchModeQuery.mockImplementationOnce(() => ({
    data: [],
    isFetching: false,
    isError: true,
  }))

  render(<ChatContext disabled={false} />)

  expect(notifyWarning).nthCalledWith(1, localize(Localization.FETCH_AGENTIC_CHAT_TOOL_SETS_FAILURE_MESSAGE))
})

test('sets toolsById after fetching', async () => {
  jest.clearAllMocks()

  render(<ChatContext disabled={false} />)

  expect(mockSetToolsById).nthCalledWith(1, mockToolsById)
})

test('renders dropdown trigger button', () => {
  render(<ChatContext disabled={false} />)

  expect(screen.getByTestId('dropdown-trigger-button')).toBeInTheDocument()
})

test('disables dropdown trigger button if disabled prop is true', () => {
  render(<ChatContext disabled={true} />)

  expect(screen.getByTestId('dropdown-trigger-button')).toBeDisabled()
})

test('renders selected tools list', () => {
  render(<ChatContext disabled={false} />)

  expect(screen.getByTestId('tags-list')).toHaveTextContent(mockTool1.name)
})

test('call setSelectedToolIds on selected tool deletion', async () => {
  jest.clearAllMocks()

  render(<ChatContext disabled={false} />)

  await userEvent.click(screen.getByTestId('close-button'))

  expect(mockSetSelectedToolIds).nthCalledWith(
    2,
    expect.any(Function),
  )
})

test('marks if tool is selected and passes all tools in dropdown', () => {
  render(<ChatContext disabled={false} />)

  const listItems = screen.getAllByRole('listitem')
  const checkboxes = screen.getAllByRole('checkbox')

  expect(listItems[0]).toHaveTextContent(mockTool1.name)
  expect(checkboxes[0]).toBeChecked()
  expect(listItems[1]).toHaveTextContent(mockTool2.name)
  expect(checkboxes[1]).not.toBeChecked()
})

test('calls selectedToolIds if tool is selected in dropdown', async () => {
  jest.clearAllMocks()

  render(<ChatContext disabled={false} />)

  const listItems = screen.getAllByRole('listitem')
  await userEvent.click(listItems[0])

  expect(mockSetSelectedToolIds).nthCalledWith(
    2,
    expect.any(Function),
  )
})
