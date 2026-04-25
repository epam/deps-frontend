
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PlusFilledIcon } from '@/components/Icons/PlusFilledIcon'
import { Position } from '@/containers/GenAIDrivenFieldModal/constants'
import { Localization, localize } from '@/localization/i18n'
import { LLMExtractionQueryNode, llmExtractionQueryWorkflowShape } from '@/models/LLMExtractor'
import { ActiveNodePrompt } from './ActiveNodePrompt'
import { NodesBuilder } from './NodesBuilder'
import {
  AddFirstNodeButton,
  Wrapper,
  NodesWrapper,
} from './PromptChainingSection.styles'

const insertNodeAtIndex = (nodes, newNode, index, position) => {
  if (index === undefined) {
    return [newNode]
  }

  const updated = [...nodes]
  const insertIndex = position === Position.BEFORE ? index : index + 1
  updated.splice(insertIndex, 0, newNode)
  return updated
}

const addConnectingEdge = (nodes) => (
  nodes.slice(1).map((node, i) => ({
    sourceId: nodes[i].id,
    targetId: node.id,
  }))
)

const PromptChainingSection = ({
  value: llmWorkflow,
  onChange,
}) => {
  const {
    nodes = [],
    edges = [],
  } = llmWorkflow || {}

  const [activeNodeId, setActiveNodeId] = useState(nodes[0]?.id)

  const activeNode = nodes.find((node) => node.id === activeNodeId)

  const updateLlmWorkflow = useCallback((updatedNodes, updatedEdges = edges) => {
    onChange({
      ...llmWorkflow,
      nodes: updatedNodes,
      edges: updatedEdges,
      startNodeId: updatedNodes[0]?.id,
      endNodeId: updatedNodes[updatedNodes.length - 1]?.id,
    })
  }, [
    edges,
    llmWorkflow,
    onChange,
  ])

  const addNewNode = useCallback(({ index, position, prompt = '' } = {}) => {
    const newNode = new LLMExtractionQueryNode({
      id: uuidv4(),
      name: `${localize(Localization.PROMPT_BLOCK)} ${nodes.length + 1}`,
      prompt,
    })

    const updatedNodes = insertNodeAtIndex(nodes, newNode, index, position)
    const updatedEdges = addConnectingEdge(updatedNodes)

    updateLlmWorkflow(updatedNodes, updatedEdges)
    setActiveNodeId(newNode.id)
  }, [
    nodes,
    updateLlmWorkflow,
  ])

  const handleNodePromptChange = useCallback((e) => {
    const prompt = e.target.value

    if (!nodes.length) {
      addNewNode({ prompt })
      return
    }

    const newNodes = nodes.map((node) => (
      node.id === activeNodeId
        ? {
          ...node,
          prompt,
        }
        : node
    ))
    updateLlmWorkflow(newNodes)
  }, [
    nodes,
    activeNodeId,
    addNewNode,
    updateLlmWorkflow,
  ])

  const deleteNode = (id) => {
    const updatedNodes = nodes.filter((node) => node.id !== id)
    const updatedEdges = addConnectingEdge(updatedNodes)

    updateLlmWorkflow(updatedNodes, updatedEdges)

    if (id === activeNodeId) {
      setActiveNodeId(updatedNodes[0].id)
    }
  }

  const renameNode = (id, newName) => {
    const updatedNodes = nodes.map((node) => (
      node.id === id
        ? {
          ...node,
          name: newName,
        }
        : node
    ))
    updateLlmWorkflow(updatedNodes)
  }

  return (
    <Wrapper>
      <NodesWrapper>
        {
          !nodes.length ? (
            <AddFirstNodeButton
              icon={<PlusFilledIcon />}
              onClick={() => addNewNode()}
            >
              {localize(Localization.ADD_PROMPT)}
            </AddFirstNodeButton>
          ) : (
            <NodesBuilder
              activeNodeId={activeNodeId}
              nodes={nodes}
              onAdd={addNewNode}
              onClick={setActiveNodeId}
              onDelete={deleteNode}
              onRename={renameNode}
            />
          )
        }
      </NodesWrapper>
      <ActiveNodePrompt
        activeNode={activeNode}
        onChange={handleNodePromptChange}
      />
    </Wrapper>
  )
}

PromptChainingSection.propTypes = {
  value: llmExtractionQueryWorkflowShape,
  onChange: PropTypes.func.isRequired,
}

export {
  PromptChainingSection,
}
