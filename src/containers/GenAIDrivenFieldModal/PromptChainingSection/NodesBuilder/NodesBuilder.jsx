
import PropTypes from 'prop-types'
import { Fragment, useState } from 'react'
import { Position } from '@/containers/GenAIDrivenFieldModal/constants'
import { Localization, localize } from '@/localization/i18n'
import { llmExtractionQueryNodeShape } from '@/models/LLMExtractor'
import { AddNewNodeButton } from '../AddNewNodeButton'
import { NodeItem } from '../NodeItem'
import { NodesConnectionLine } from '../NodesConnectionLine'

const getErrorMessageForNode = (node) => {
  if (!node.prompt?.trim()) {
    return `(${localize(Localization.ENTER_PROMPT)})`
  }

  return null
}

const NodesBuilder = ({
  nodes,
  onAdd,
  onDelete,
  onClick,
  onRename,
  activeNodeId,
}) => {
  const [nodesToValidate, setNodesToValidate] = useState(new Set())

  const handleAddNewNode = (e, index, position) => {
    e.preventDefault()

    setNodesToValidate((prev) => (
      new Set([...prev, ...nodes.map((n) => n.id)])
    ))

    onAdd({
      index,
      position,
    })
  }

  const handleNodeClick = (id) => {
    if (id !== activeNodeId) {
      setNodesToValidate((prev) => {
        const newSet = new Set(prev)
        newSet.add(activeNodeId)
        return newSet
      })
    }

    onClick(id)
  }

  return (
    <>
      <AddNewNodeButton onClick={(e) => handleAddNewNode(e, 0, Position.BEFORE)} />
      {
        nodes.map((node, index) => {
          const errorMessage = nodesToValidate.has(node.id) ? getErrorMessageForNode(node) : ''
          const isLastNode = index === nodes.length - 1

          return (
            <Fragment key={node.id}>
              <NodeItem
                errorMessage={errorMessage}
                id={node.id}
                isActive={activeNodeId === node.id}
                name={node.name}
                onClick={handleNodeClick}
                onRename={onRename}
                {...(nodes.length > 1 && { onDelete })}
              />
              {
                isLastNode
                  ? <AddNewNodeButton onClick={(e) => handleAddNewNode(e, index, Position.AFTER)} />
                  : <NodesConnectionLine onAdd={(e) => handleAddNewNode(e, index, Position.AFTER)} />
              }
            </Fragment>
          )
        })
      }
    </>
  )
}

NodesBuilder.propTypes = {
  nodes: PropTypes.arrayOf(llmExtractionQueryNodeShape).isRequired,
  onAdd: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  activeNodeId: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
}

export {
  NodesBuilder,
}
