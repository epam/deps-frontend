
import PropTypes from 'prop-types'
import { MentionsInput, Mention } from 'react-mentions'
import { mentionOptionShape } from './MentionOption'
import { Wrapper } from './MentionsField.styles'

const MENTIONS_CLASS_NAME = 'mentions'
const MENTION_CLASS_NAME = 'mention'

const MentionsField = ({
  value,
  onChange,
  placeholder,
  trigger,
  markup,
  className,
  data,
  allowSpaceInQuery,
  allowSuggestionsAboveCursor,
  displayTransform,
  renderSuggestion,
  ...rest
}) => (
  <Wrapper className={className}>
    <MentionsInput
      allowSuggestionsAboveCursor={allowSuggestionsAboveCursor}
      className={MENTIONS_CLASS_NAME}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      {...rest}
    >
      <Mention
        allowSpaceInQuery={allowSpaceInQuery}
        className={MENTION_CLASS_NAME}
        data={data}
        displayTransform={displayTransform}
        markup={markup}
        renderSuggestion={renderSuggestion}
        trigger={trigger}
      />
    </MentionsInput>
  </Wrapper>
)

MentionsField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  trigger: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(RegExp),
  ]),
  markup: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(mentionOptionShape),
    PropTypes.func,
  ]),
  allowSpaceInQuery: PropTypes.bool,
  allowSuggestionsAboveCursor: PropTypes.bool,
  displayTransform: PropTypes.func,
  renderSuggestion: PropTypes.func,
}

export {
  MentionsField,
}
