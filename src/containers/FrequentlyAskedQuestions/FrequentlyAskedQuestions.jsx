
import { PropTypes } from 'prop-types'
import React, { useState, useCallback, useMemo } from 'react'
import { ExpandIconPosition } from '@/components/Collapse'
import { NoData } from '@/components/NoData'
import { TextHighlighter } from '@/components/TextHighlighter'
import { SearchInput } from '@/containers/SearchInput'
import { Localization, localize } from '@/localization/i18n'
import { AddUser } from './components/AddUser'
import { DefineDocumentType } from './components/DefineDocumentType'
import { ExportData } from './components/ExportData'
import { ExtractData } from './components/ExtractData'
import { LabelDocument } from './components/LabelDocument'
import { Review } from './components/Review'
import { Search } from './components/Search'
import { UploadDocument } from './components/UploadDocument'
import { Validation } from './components/Validation'
import {
  Wrapper,
  Collapse,
  Icon,
  Question,
  SearchInputWrapper,
} from './FrequentlyAskedQuestions.styles'

const RotatedIcon = ({ isActive }) => (
  <Icon rotate={isActive ? 180 : 0} />
)

const FREQUENTLY_ASKED_QUESTIONS = [
  {
    collapseId: localize(Localization.UPLOAD_QUESTION),
    title: localize(Localization.UPLOAD_QUESTION),
    children: <UploadDocument />,
  },
  {
    collapseId: localize(Localization.DOCUMENT_TYPE_QUESTION),
    title: localize(Localization.DOCUMENT_TYPE_QUESTION),
    children: <DefineDocumentType />,
  },
  {
    collapseId: localize(Localization.EXTRACT_DATA_QUESTION),
    title: localize(Localization.EXTRACT_DATA_QUESTION),
    children: <ExtractData />,
  },
  {
    collapseId: localize(Localization.REVIEW_QUESTION),
    title: localize(Localization.REVIEW_QUESTION),
    children: <Review />,
  },
  {
    collapseId: localize(Localization.VALIDATION_QUESTION),
    title: localize(Localization.VALIDATION_QUESTION),
    children: <Validation />,
  },
  {
    collapseId: localize(Localization.EXPORT_DATA_QUESTION),
    title: localize(Localization.EXPORT_DATA_QUESTION),
    children: <ExportData />,
  },
  {
    collapseId: localize(Localization.LABEL_QUESTION),
    title: localize(Localization.LABEL_QUESTION),
    children: <LabelDocument />,
  },
  {
    collapseId: localize(Localization.SEARCH_QUESTION),
    title: localize(Localization.SEARCH_QUESTION),
    children: <Search />,
  },
  {
    collapseId: localize(Localization.ADD_USER_QUESTION),
    title: localize(Localization.ADD_USER_QUESTION),
    children: <AddUser />,
  },
]

const FrequentlyAskedQuestions = () => {
  const [filter, setFilter] = useState('')

  const onChangeFilter = useCallback(
    (value) => setFilter(value),
    [setFilter],
  )

  const filteredHelpPageComponents = useMemo(
    () => (
      FREQUENTLY_ASKED_QUESTIONS.filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
    ),
    [filter],
  )

  const renderHelpPageComponents = useCallback(
    () => (
      filteredHelpPageComponents.map((component) => (
        <Collapse
          key={component.title}
          bordered={false}
          collapseId={component.collapseId}
          expandIcon={RotatedIcon}
          expandIconPosition={ExpandIconPosition.END}
          header={
            (
              <Question>
                <TextHighlighter
                  searchTerm={filter}
                  text={component.title}
                />
              </Question>
            )
          }
        >
          {component.children}
        </Collapse>
      ))
    ),
    [
      filter,
      filteredHelpPageComponents,
    ],
  )

  const renderContent = useMemo(
    () => {
      if (!filteredHelpPageComponents.length) {
        return (
          <NoData description={localize(Localization.NO_MATCHES)} />
        )
      }

      return renderHelpPageComponents()
    },
    [
      filteredHelpPageComponents,
      renderHelpPageComponents,
    ],
  )

  return (
    <Wrapper>
      <SearchInputWrapper>
        <SearchInput
          autoFocus={true}
          filter={filter}
          onChange={onChangeFilter}
        />
      </SearchInputWrapper>
      {renderContent}
    </Wrapper>
  )
}

RotatedIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
}

export {
  FrequentlyAskedQuestions,
}
