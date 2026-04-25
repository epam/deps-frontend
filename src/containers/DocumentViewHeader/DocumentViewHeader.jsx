
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getDocumentError } from '@/actions/documentReviewPage'
import { DOCUMENT_HEADER } from '@/constants/automation'
import { BackToSourceButton } from '@/containers/BackToSourceButton'
import { DocumentNavigationButton } from '@/containers/DocumentNavigationButton'
import { DocumentReviewControls } from '@/containers/DocumentReviewControls'
import { DocumentState } from '@/enums/DocumentState'
import { documentShape } from '@/models/Document'
import { navigationMap } from '@/utils/navigationMap'
import { DocumentNavigationTitle } from './DocumentNavigationTitle'
import {
  Header,
  CommandsSeparator,
  InfoWrapper,
  InfoWrapperCell,
  Wrapper,
  LongLabelsList,
} from './DocumentViewHeader.styles'
import { ErrorMessage } from './ErrorMessage'

const ERROR_STATES = [
  DocumentState.FAILED,
  DocumentState.POSTPONED,
]

const DocumentViewHeader = ({
  document,
}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    ERROR_STATES.includes(document.state) &&
    !document.error &&
    dispatch(getDocumentError())
  }, [
    dispatch,
    document.error,
    document.state,
  ])

  return (
    <Wrapper>
      <Header
        data-automation={DOCUMENT_HEADER}
      >
        <BackToSourceButton sourcePath={navigationMap.documents()} />
        <InfoWrapper>
          <InfoWrapperCell>
            <DocumentNavigationTitle />
            <DocumentNavigationButton />
          </InfoWrapperCell>
          {
            !!document.labels?.length && (
              <LongLabelsList
                documentId={document._id}
                labels={document.labels}
              />
            )
          }
        </InfoWrapper>
        {!!document.labels?.length && <CommandsSeparator />}
        <DocumentReviewControls />
      </Header>
      {
        document.error && (
          <ErrorMessage
            documentId={document._id}
            error={document.error}
            state={document.state}
          />
        )
      }
    </Wrapper>
  )
}

DocumentViewHeader.propTypes = {
  document: documentShape.isRequired,
}

export {
  DocumentViewHeader,
}
