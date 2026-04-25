
import PropTypes from 'prop-types'
import {
  useState,
  useMemo,
  useCallback,
} from 'react'
import { QueryNode, queryNodeShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { AddPromptModal } from './AddPromptModal'
import { EmptyPromptState } from './EmptyPromptState'
import { NodesBuilder } from './NodesBuilder'

export const PromptChain = ({
  onSaveNodes,
  queryNodes,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeNode, setActiveNode] = useState(null)
  const [nodePosition, setNodePosition] = useState(null)

  const toggleAddPromptModal = useCallback(() => {
    setIsVisible((prevIsVisible) => !prevIsVisible)
  }, [setIsVisible])

  const onEditHandler = useCallback((node) => {
    setActiveNode(node)
    toggleAddPromptModal()
  }, [setActiveNode, toggleAddPromptModal])

  const onAddHandler = useCallback((position) => {
    setNodePosition(position)
    toggleAddPromptModal()
  }, [toggleAddPromptModal])

  const onCloseHandler = useCallback(() => {
    setActiveNode(null)
    setNodePosition(null)
    toggleAddPromptModal()
  }, [toggleAddPromptModal])

  const updateExistingNodes = useCallback((name, prompt) => {
    const newNodes = queryNodes.map((node) => {
      if (node.id === activeNode.id) {
        return {
          ...node,
          name,
          prompt,
        }
      }

      return node
    })

    onSaveNodes(newNodes)
    onCloseHandler()
  }, [
    queryNodes,
    onSaveNodes,
    activeNode?.id,
    onCloseHandler,
  ])

  const addNewNode = useCallback((name, prompt) => {
    const updatedNodes = [...queryNodes]
    const newNode = new QueryNode({
      name,
      prompt,
    })

    updatedNodes.splice(nodePosition, 0, newNode)

    onSaveNodes(updatedNodes)
    onCloseHandler()
  }, [
    queryNodes,
    nodePosition,
    onSaveNodes,
    onCloseHandler,
  ])

  const onSaveHandler = useCallback((name, prompt) => {
    if (activeNode) {
      updateExistingNodes(name, prompt)
      return
    }

    addNewNode(name, prompt)
  }, [
    activeNode,
    addNewNode,
    updateExistingNodes,
  ])

  const Content = useMemo(() => {
    if (!queryNodes.length) {
      return <EmptyPromptState onClick={toggleAddPromptModal} />
    }

    return (
      <NodesBuilder
        nodes={queryNodes}
        onAdd={onAddHandler}
        onDelete={onSaveNodes}
        onEdit={onEditHandler}
        onReorder={onSaveNodes}
      />
    )
  }, [
    queryNodes,
    onAddHandler,
    onEditHandler,
    toggleAddPromptModal,
    onSaveNodes,
  ])

  return (
    <>
      {Content}
      {
        isVisible && (
          <AddPromptModal
            node={activeNode}
            onClose={onCloseHandler}
            onSave={onSaveHandler}
          />
        )
      }
    </>
  )
}

PromptChain.propTypes = {
  onSaveNodes: PropTypes.func.isRequired,
  queryNodes: PropTypes.arrayOf(queryNodeShape).isRequired,
}
