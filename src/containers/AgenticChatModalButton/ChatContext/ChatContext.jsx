
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useEffect,
} from 'react'
import { useFetchModeQuery } from '@/apiRTK/agenticAiApi'
import { LayerGroupIcon } from '@/components/Icons/LayerGroupIcon'
import { Spin } from '@/components/Spin'
import { AgenticAiModes } from '@/enums/AgenticAiModes'
import { localize, Localization } from '@/localization/i18n'
import { Tag } from '@/models/Tag'
import { notifyWarning } from '@/utils/notification'
import { useChatSettings } from '../hooks'
import {
  LongTagsList,
  Wrapper,
} from './ChatContext.styles'
import { ChatContextDropdown } from './ChatContextDropdown'

const EMPTY_MODES = []

const ChatContext = ({ disabled }) => {
  const {
    selectedToolIds,
    setSelectedToolIds,
    toolsById,
    setToolsById,
  } = useChatSettings()

  const {
    data: modes = EMPTY_MODES,
    isError,
    isFetching,
  } = useFetchModeQuery({
    code: AgenticAiModes.DOCUMENT,
  }, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (isError) {
      notifyWarning(localize(Localization.FETCH_AGENTIC_CHAT_TOOL_SETS_FAILURE_MESSAGE))
    }
  }, [isError])

  useEffect(() => {
    setSelectedToolIds([])

    const allTools = modes.flatMap((mode) =>
      mode.toolSets.flatMap((toolSet) =>
        toolSet.tools.map((tool) => ({
          ...tool,
          id: `${toolSet.code}-${tool.code}`,
          toolSetCode: toolSet.code,
        })),
      ),
    )

    const allToolsById = Object.fromEntries(
      allTools.map((tool) => [tool.id, tool]),
    )

    setToolsById(allToolsById)
  }, [
    modes,
    setSelectedToolIds,
    setToolsById,
  ])

  const toolsList = useMemo(() =>
    Object.values(toolsById).map(({ id, name }) => ({
      id,
      name,
      isSelected: selectedToolIds.includes(id),
    })),
  [selectedToolIds, toolsById],
  )

  const onToolSelect = useCallback((toolId) => setSelectedToolIds((prevValue) => {
    if (prevValue.includes(toolId)) {
      return prevValue.filter((id) => id !== toolId)
    }

    return [toolId, ...prevValue]
  }), [setSelectedToolIds])

  const deleteTool = useCallback(({ id }) =>
    setSelectedToolIds((prevValue) => prevValue.filter((item) => item !== id)),
  [setSelectedToolIds],
  )

  const tags = useMemo(() => selectedToolIds.map((id) =>
    new Tag({
      id,
      text: toolsById[id].name,
    })),
  [selectedToolIds, toolsById],
  )

  if (isFetching) {
    return (
      <Spin.Centered spinning />
    )
  }

  return (
    <Wrapper>
      {
        !!toolsList.length && (
          <ChatContextDropdown
            disabled={disabled}
            onToolSelect={onToolSelect}
            toolsList={toolsList}
          />
        )
      }
      {
        !!selectedToolIds.length && (
          <LongTagsList
            getPopupContainer={(trigger) => trigger}
            icon={<LayerGroupIcon />}
            isTagClosable={true}
            onTagClose={deleteTool}
            tags={tags}
          />
        )
      }
    </Wrapper>
  )
}

ChatContext.propTypes = {
  disabled: PropTypes.bool,
}

export {
  ChatContext,
}
