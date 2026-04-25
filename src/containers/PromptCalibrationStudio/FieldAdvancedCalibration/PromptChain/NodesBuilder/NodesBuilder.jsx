
import PropTypes from 'prop-types'
import {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { queryNodeShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { AddNewNodeButton } from '../AddNewNodeButton'
import { NodeItem } from '../NodeItem'
import { NodesConnectionLine } from '../NodesConnectionLine'
import { DraggableNodeItem, Wrapper } from './NodesBuilder.styles'

const DRAGGABLE_TYPE = 'PromptChainNode'

export const NodesBuilder = ({
  onAdd,
  nodes,
  onDelete,
  onEdit,
  onReorder,
}) => {
  const [orderedNodes, setOrderedNodes] = useState(nodes)

  const currentNodes = useRef(nodes)

  useEffect(() => {
    setOrderedNodes(nodes)
    currentNodes.current = nodes
  }, [nodes])

  const handleDeleteNode = (id) => {
    const filteredNodes = nodes.filter((n) => n.id !== id)
    onDelete(filteredNodes)
  }

  const handleEditNode = (id) => {
    const node = nodes.find((n) => n.id === id)
    onEdit(node)
  }

  const handleAddNewNode = (position) => {
    onAdd(position)
  }

  const handleMove = useCallback((dragIndex, hoverIndex) => {
    setOrderedNodes((prevNodes) => {
      const resultArr = [...prevNodes]
      const [item] = resultArr.splice(dragIndex, 1)
      resultArr.splice(hoverIndex, 0, item)
      currentNodes.current = resultArr
      return resultArr
    })
  }, [])

  const handleDragEnd = useCallback(() => {
    const hasOrderChanged = currentNodes.current.some((node, i) => node.id !== nodes[i]?.id)

    if (hasOrderChanged) {
      onReorder(currentNodes.current)
    }
  }, [nodes, onReorder])

  return (
    <Wrapper>
      <AddNewNodeButton onClick={() => handleAddNewNode(0)} />
      {
        orderedNodes.map((node, index) => {
          const isLastNode = index === orderedNodes.length - 1

          return (
            <Fragment key={node.id}>
              <DraggableNodeItem
                index={index}
                isDraggable={orderedNodes.length > 1}
                onDragEnd={handleDragEnd}
                onMove={handleMove}
                type={DRAGGABLE_TYPE}
              >
                <NodeItem
                  isDeleteHidden={orderedNodes.length <= 1}
                  node={node}
                  onDelete={handleDeleteNode}
                  onEdit={handleEditNode}
                  promptNumber={index + 1}
                />
              </DraggableNodeItem>
              {
                isLastNode
                  ? <AddNewNodeButton onClick={() => handleAddNewNode(index + 1)} />
                  : <NodesConnectionLine onAdd={() => handleAddNewNode(index + 1)} />
              }
            </Fragment>
          )
        })
      }
    </Wrapper>
  )
}

NodesBuilder.propTypes = {
  onAdd: PropTypes.func.isRequired,
  nodes: PropTypes.arrayOf(queryNodeShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
}
