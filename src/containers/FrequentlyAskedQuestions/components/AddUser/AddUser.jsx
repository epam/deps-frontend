
import { WrapperImg } from '@/containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions.styles'
import { Localization, localize } from '@/localization/i18n'
import {
  AddUserButtonImage,
  EnterEmailImage,
  InviteToTheOrganizationImage,
  SendInviteImage,
} from './AddUser.styles'

const AddUser = () => (
  <>
    <div>
      <p>{localize(Localization.ADD_USER_PARAGRAPH_1)}</p>
      <p><b>{localize(Localization.ADD_USER_SUBTITLE_1)}</b></p>
      <p>
        <b>{localize(Localization.ADD_USER_STEP, { number: 1 })}</b>
        {localize(Localization.ADD_USER_PARAGRAPH_2)}
      </p>
    </div>
    <WrapperImg>
      <AddUserButtonImage />
      <InviteToTheOrganizationImage />
    </WrapperImg>
    <div>
      <p>
        <b>{localize(Localization.ADD_USER_STEP, { number: 2 })}</b>
        {localize(Localization.ADD_USER_PARAGRAPH_3)}
      </p>
      <p>
        <i>{localize(Localization.ADD_USER_NOTE)}</i>
        {localize(Localization.ADD_USER_PARAGRAPH_4)}
      </p>
    </div>
    <WrapperImg>
      <EnterEmailImage />
      <SendInviteImage />
    </WrapperImg>
    <div>
      <p>
        <b>{localize(Localization.ADD_USER_STEP, { number: 3 })}</b>
        {localize(Localization.ADD_USER_PARAGRAPH_5)}
      </p>
      <p>
        <i>{localize(Localization.ADD_USER_NOTE)}</i>
        {localize(Localization.ADD_USER_PARAGRAPH_6)}
      </p>
    </div>
  </>
)

export {
  AddUser,
}
