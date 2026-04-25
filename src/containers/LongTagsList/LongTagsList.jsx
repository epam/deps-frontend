
import PropTypes from 'prop-types'
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Dropdown } from '@/components/Dropdown'
import { LongText } from '@/components/LongText'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import { tagShape } from '@/models/Tag'
import {
  Tag,
  TagsWrapper,
  Menu,
  MenuItem,
  MoreTagsButton,
} from './LongTagsList.styles'

const SHOW_MORE_BUTTON_WIDTH = 75

const LongTagsList = ({
  className,
  getPopupContainer,
  icon,
  isTagClosable,
  offset = 0,
  onTagClick,
  onTagClose,
  tags,
  renderVisibleTagContent,
}) => {
  const [visibleTags, setVisibleTags] = useState(tags)
  const containerRef = useRef(null)
  const tagRefs = useRef({})

  const hiddenTags = tags.filter((t) => !visibleTags.includes(t))

  const getVisibleTags = useCallback(() => {
    let totalWidth = 0
    const hiddenTags = []
    const containerWidth = containerRef.current?.offsetWidth ?? 0

    const visibleTags = tags.reduce((acc, tag) => {
      const tagWidth = tagRefs.current[tag.id] ?? 0
      const isTagFitContainer = totalWidth + tagWidth + offset + SHOW_MORE_BUTTON_WIDTH <= containerWidth
      const isLastTag = tags[tags.length - 1] === tag

      if (isTagFitContainer) {
        acc.push(tag)
        totalWidth += tagWidth
      } else {
        hiddenTags.push(tag)
      }

      if (isLastTag && hiddenTags.length === 1) {
        const [hiddenTag] = hiddenTags
        const hiddenTagWidth = tagRefs.current[hiddenTag.id]
        const isTagFitContainer = hiddenTagWidth + totalWidth + offset <= containerWidth
        isTagFitContainer && acc.push(hiddenTag)
        totalWidth += hiddenTag
      }

      return acc
    }, [])

    setVisibleTags(visibleTags)
  }, [
    offset,
    tags,
  ])

  useResizeObserver({
    element: containerRef.current,
    onResize: getVisibleTags,
  })

  useLayoutEffect(() => {
    getVisibleTags()
  }, [getVisibleTags])

  const renderHiddenTagsList = () => (
    <Menu>
      {
        hiddenTags.map((tag) => (
          <MenuItem
            key={tag.id}
          >
            <Tag
              closable={isTagClosable}
              onClick={onTagClick}
              onClose={() => onTagClose(tag)}
            >
              <LongText text={tag.text} />
            </Tag>
          </MenuItem>
        ))
      }
    </Menu>
  )

  const setTagRef = (el, tag) => {
    if (el?.offsetWidth) {
      tagRefs.current[tag.id] = el.offsetWidth
    }
  }

  return (
    <TagsWrapper
      ref={containerRef}
      className={className}
    >
      {
        visibleTags.map((tag) => (
          <Tag
            key={tag.id}
            ref={(el) => setTagRef(el, tag)}
            closable={isTagClosable}
            onClick={onTagClick}
            onClose={() => onTagClose(tag)}
          >
            {renderVisibleTagContent?.(tag) ?? <LongText text={tag.text} />}
          </Tag>
        ))
      }
      {
        !!hiddenTags.length && (
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              destroyPopupOnHide
              dropdownRender={renderHiddenTagsList}
              getPopupContainer={getPopupContainer}
            >
              <MoreTagsButton closable={false}>
                {icon}
                {`+ ${hiddenTags.length}`}
              </MoreTagsButton>
            </Dropdown>
          </div>
        )
      }
    </TagsWrapper>
  )
}

LongTagsList.propTypes = {
  className: PropTypes.string,
  getPopupContainer: PropTypes.func,
  icon: PropTypes.element,
  isTagClosable: PropTypes.bool,
  onTagClick: PropTypes.func,
  onTagClose: PropTypes.func,
  offset: PropTypes.number,
  tags: PropTypes.arrayOf(tagShape).isRequired,
  renderVisibleTagContent: PropTypes.func,
}

export {
  LongTagsList,
}
