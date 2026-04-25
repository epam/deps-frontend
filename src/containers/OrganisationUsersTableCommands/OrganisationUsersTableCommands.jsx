
import { AddUserButton } from '@/containers/AddUserButton'
import { DeleteUsersButton } from '@/containers/DeleteUsersButton'
import { ENV } from '@/utils/env'
import { Wrapper } from './OrganisationUsersTableCommands.styles'

const OrganisationUsersTableCommands = () => (
  <Wrapper>
    {
      (ENV.FEATURE_INVITE_BY_MAIL || ENV.FEATURE_COPY_INVITE) && (
        <AddUserButton />
      )
    }
    <DeleteUsersButton />
  </Wrapper>
)

export {
  OrganisationUsersTableCommands,
}
