
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { TagIcon } from '@/components/Icons/TagIcon'
import { MenuTrigger } from '@/components/Menu'
import { Tooltip } from '@/components/Tooltip'
import { ComponentSize } from '@/enums/ComponentSize'
import { Placement } from '@/enums/Placement'
import { prototypeTabularMappingShape } from '@/models/PrototypeTableField'
import {
  HeaderNameTag,
  AliasesNumberBadge,
  HeaderName,
  Wrapper,
  HiddenHeadersTooltip,
  VisibleHeadersWrapper,
  TagButton,
  Counter,
  AliasTag,
} from './MappingHeaders.styles'

const MAX_VISIBLE_HEADERS = 3

const MappingHeaders = ({
  tabularMapping,
  updateHeaders,
  isEditMode,
}) => {
  const isHeaderDeletingAllowed = isEditMode && tabularMapping.headers.length > 1

  const handleRemoveHeader = useCallback((headerToRemoveIdx) => {
    const headers = tabularMapping.headers.filter(
      (key, index) => index !== headerToRemoveIdx,
    )

    updateHeaders(headers)
  }, [tabularMapping, updateHeaders])

  const getAliasesTags = (aliases) => (
    aliases.map((alias, i) => (
      <AliasTag
        key={i}
        $isEmpty={!alias}
        closable={false}
      >
        {alias}
      </AliasTag>
    ))
  )

  const getHeadersItems = useCallback((headers, areHidden) => (
    headers.map(({ name, aliases }, index) => {
      const idx = areHidden ? index + MAX_VISIBLE_HEADERS : index
      return (
        <HeaderNameTag
          key={idx}
          $isEmpty={!name}
          closable={isHeaderDeletingAllowed}
          onClose={() => handleRemoveHeader(idx)}
        >
          <HeaderName text={name} />
          <Tooltip title={getAliasesTags(aliases)}>
            <AliasesNumberBadge
              count={aliases.length}
              size={ComponentSize.SMALL}
            />
          </Tooltip>
        </HeaderNameTag>
      )
    })
  ), [
    isHeaderDeletingAllowed,
    handleRemoveHeader,
  ])

  const getVisibleHeaders = useCallback((visibleHeaders) => (
    <VisibleHeadersWrapper>
      {getHeadersItems(visibleHeaders)}
    </VisibleHeadersWrapper>
  ), [getHeadersItems])

  const getHiddenHeaders = useCallback((hiddenHeaders) => (
    <HiddenHeadersTooltip
      getPopupContainer={(trigger) => trigger.parentNode}
      placement={Placement.BOTTOM}
      title={getHeadersItems(hiddenHeaders, true)}
      trigger={MenuTrigger.CLICK}
    >
      <TagButton>
        <TagIcon />
        <Counter>
          +
          {hiddenHeaders.length}
        </Counter>
      </TagButton>
    </HiddenHeadersTooltip>
  ), [getHeadersItems])

  const headers = [...tabularMapping.headers]
  const visibleHeaders = headers.splice(0, MAX_VISIBLE_HEADERS)

  return (
    <Wrapper>
      {getVisibleHeaders(visibleHeaders)}
      {!!headers.length && getHiddenHeaders(headers)}
    </Wrapper>
  )
}

MappingHeaders.propTypes = {
  tabularMapping: prototypeTabularMappingShape.isRequired,
  updateHeaders: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
}

export {
  MappingHeaders,
}
