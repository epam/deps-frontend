
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { addComment } from '@/actions/documentReviewPage'
import { getUser } from '@/api/iamApi'
import { Button, ButtonType } from '@/components/Button'
import { LoadingIcon } from '@/components/Icons/LoadingIcon'
import { Input } from '@/components/Input'
import { Spin } from '@/components/Spin'
import { localize, Localization } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { User } from '@/models/User'
import {
  documentSelector,
  idSelector,
} from '@/selectors/documentReviewPage'
import { toLocalizedDateString } from '@/utils/dayjs'
import {
  notifyRequest,
  notifyWarning,
} from '@/utils/notification'
import {
  CommentsContent,
  CommentsInput,
  CommentsHeader,
  CommentsBtnGroup,
  CommentItem,
  CommentUser,
} from './DocumentComments.styles'

const { TextArea } = Input

class DocumentComments extends Component {
  state = {
    comment: '',
    fetching: true,
    users: null,
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    document: documentShape.isRequired,
    addComment: PropTypes.func.isRequired,
  }

  changeComment = (e) => {
    this.setState({ comment: e.target.value })
  }

  createComment = async () => {
    this.setState({ fetching: true })

    const commentConfig = await notifyRequest(this.props.addComment(this.props.id, this.state.comment))({
      fetching: localize(Localization.FETCHING_ADD_COMMENT),
      success: localize(Localization.ADD_COMMENT_SUCCESSFUL),
      warning: localize(Localization.ADD_COMMENT_FAILED),
    })

    if (!commentConfig.createdBy) {
      this.setState({
        comment: '',
        fetching: false,
      })
      return
    }

    try {
      const user = await getUser(commentConfig.createdBy)
      this.setState((state) => ({
        users: {
          ...state.users,
          ...user,
        },
      }))
    } catch {
      notifyWarning(localize(Localization.GET_USER_FAILED))
    }
    this.setState({
      comment: '',
      fetching: false,
    })
  }

  getEmail = (email) => email ? `(${email})` : ''

  getAuthor = (commentConfig) => {
    const user = this.state.users?.[commentConfig.createdBy] ?? new User(
      null,
      localize(Localization.UNKNOWN),
      localize(Localization.UNKNOWN_LAST_NAME),
      null,
    )

    const {
      username,
      email: userEmail,
      firstName,
      lastName,
    } = user

    const email = this.getEmail(userEmail)

    if (!lastName && !firstName) {
      return `${username} ${email}`.trim()
    }

    return `${firstName} ${lastName} ${email}`.trim()
  }

  renderComments = () => {
    if (this.state.fetching) {
      return <Spin.Centered spinning />
    }

    return (
      this.props.document.communication.comments.map((commentConfig, i) => (
        <CommentItem key={i}>
          {toLocalizedDateString(commentConfig.createdAt, true)}
          <CommentUser>
            {`${this.getAuthor(commentConfig)}:`}
          </CommentUser>
          {`"${commentConfig.text}"`}
        </CommentItem>
      ))
    )
  }

  getCommentsUsers = async () => {
    const userIds = this.props.document.communication.comments
      .map((c) => c.createdBy)
      .filter((id) => !!id)

    if (!userIds.length) {
      this.setState({ fetching: false })
    }

    try {
      const requests = userIds.map((userId) => getUser(userId))
      const response = await Promise.all(requests)
      const users = response.reduce((acc, userData) => ({
        ...acc,
        ...userData,
      }), {})

      this.setState({
        fetching: false,
        users,
      })
    } catch {
      notifyWarning(localize(Localization.GET_USER_FAILED))
      this.setState({
        fetching: false,
      })
    }
  }

  componentDidMount = () => {
    this.getCommentsUsers()
  }

  render = () => (
    <CommentsContent>
      <CommentsInput>
        <CommentsHeader>
          {localize(Localization.COMMENTS_HEADER)}
        </CommentsHeader>
        <TextArea
          autoSize={
            {
              minRows: 5,
              maxRows: 10,
            }
          }
          onChange={this.changeComment}
          placeholder={localize(Localization.COMMENTS_PLACEHOLDER)}
          value={this.state.comment}
        />
        <CommentsBtnGroup>
          <Button
            disabled={!this.state.comment.length || this.state.fetching}
            onClick={this.createComment}
            type={ButtonType.PRIMARY}
          >
            {this.state.fetching && <LoadingIcon />}
            {localize(Localization.ADD)}
          </Button>
        </CommentsBtnGroup>
      </CommentsInput>
      {this.renderComments()}
    </CommentsContent>
  )
}

const mapStateToProps = (state) => ({
  id: idSelector(state),
  document: documentSelector(state),
})

const ConnectedComponent = connect(mapStateToProps, { addComment })(DocumentComments)

export {
  ConnectedComponent as DocumentComments,
}
