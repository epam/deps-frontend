
import { mockSelector } from '@/mocks/mockSelector'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'

const user = new User(
  'system_user@system.com',
  'System',
  'User',
  new Organisation(
    '1111',
    'TestOrganisation',
    'https://host/customisation.js',
  ),
  'systemUser',
  '111-111-111',
  '12-08-2022',
)

const userSelector = mockSelector(
  user,
)

export {
  userSelector,
}
