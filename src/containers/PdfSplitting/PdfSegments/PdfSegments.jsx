
import PropTypes from 'prop-types'
import { DocumentTypesGroupsSelect } from '@/containers/DocumentTypesGroupsSelect'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { usePdfSegments } from '../hooks'
import { PdfSegment as SegmentModel } from '../models'
import { BatchNameInput } from './BatchNameInput'
import { Footer } from './Footer'
import { PdfSegment } from './PdfSegment'
import {
  Content,
  GroupSelectWrapper,
  SegmentsWrapper,
  StyledGroupLabel,
  Title,
  Wrapper,
} from './PdfSegments.styles'

export const PdfSegments = ({ onCancel, onSave }) => {
  const {
    segments,
    setSegments,
    initialSegment,
    setActiveUserPage,
    batchName,
    selectedGroup,
    setSelectedGroup,
  } = usePdfSegments()

  const onClear = () => {
    setSegments([initialSegment])
    setActiveUserPage(null)
    setSelectedGroup(null)
  }

  const removeSegment = (id) => {
    const segmentIndex = segments.findIndex((s) => s.id === id)
    const currentSegment = segments[segmentIndex]
    const nextSegment = segments[segmentIndex + 1]
    const prevSegment = segments[segmentIndex - 1]

    const segmentMergeWith = segmentIndex > 0 ? currentSegment : nextSegment
    const segmentMergeTo = segmentIndex > 0 ? prevSegment : currentSegment

    const newSegments = segments.reduce((a, c) => {
      if (c === segmentMergeWith) {
        return a
      }

      if (c === segmentMergeTo) {
        return [
          ...a,
          SegmentModel.merge(segmentMergeTo, segmentMergeWith),
        ]
      }

      return [...a, c]
    }, [])

    setSegments(newSegments)
  }

  const toggleSelection = (id) => {
    const segment = segments.find((s) => s.id === id)
    const newSegments = segments.map((s) => {
      if (s === segment) {
        return SegmentModel.toggleSelection(segment)
      }

      return {
        ...s,
        isSelected: false,
      }
    })

    setSegments(newSegments)
  }

  const changeDocumentTypeId = (id, documentTypeId) => {
    const newSegments = segments.map((s) => {
      if (s.id === id) {
        return SegmentModel.setDocumentTypeId(s, documentTypeId)
      }

      return s
    })

    setSegments(newSegments)
  }

  const onSaveHandler = () => {
    onSave(batchName)
  }

  const hasGroupId = !!selectedGroup?.id
  const allSegmentsHaveDocumentType = segments.every((s) => !!s.documentTypeId)
  const meetsBatchCreationConstraint = hasGroupId || allSegmentsHaveDocumentType
  const isSaveDisabled = !batchName || !meetsBatchCreationConstraint

  return (
    <Wrapper>
      {
        batchName !== null && (
          <BatchNameInput />
        )
      }
      {
        ENV.FEATURE_DOCUMENT_TYPES_GROUPS && batchName !== null && (
          <GroupSelectWrapper>
            <StyledGroupLabel
              name={localize(Localization.GROUP)}
              required={false}
            />
            <DocumentTypesGroupsSelect
              onChange={setSelectedGroup}
              value={selectedGroup}
            />
          </GroupSelectWrapper>
        )
      }
      <SegmentsWrapper>
        <Title>
          {localize(Localization.SEGMENTS)}
        </Title>
        <Content>
          {
            segments.map((segment, index) => (
              <PdfSegment
                key={segment.id}
                index={index}
                onDelete={removeSegment}
                onDocTypeIdChange={changeDocumentTypeId}
                onSelect={toggleSelection}
                segment={segment}
              />
            ))
          }
        </Content>
      </SegmentsWrapper>
      <Footer
        isSaveDisabled={isSaveDisabled}
        onCancel={onCancel}
        onClear={onClear}
        onSave={onSave && onSaveHandler}
      />
    </Wrapper>
  )
}

PdfSegments.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
}
