
import { User } from '@/models/User'

const mockUserData = new User(
  'email.com',
  'Jon',
  'Doe',
  'mock_org',
  'Jon_Doe',
  '1',
  new Date().toString(),
  'mock_url.com',
)

describe('Model: User', () => {
  describe('method: getTitle', () => {
    it('should return correct title based on props', () => {
      expect(User.getTitle(mockUserData)).toEqual('Jon Doe')
    })

    it('should return correct title based if lastName are not provided', () => {
      const user = {
        ...mockUserData,
        lastName: null,
      }

      expect(User.getTitle(user)).toEqual('Jon')
    })

    it('should return correct title if firstName is not provided', () => {
      const user = {
        ...mockUserData,
        firstName: null,
      }

      expect(User.getTitle(user)).toEqual('Doe')
    })

    it('should return correct title in case of firstName and lastName are not provided', () => {
      const user = {
        ...mockUserData,
        firstName: null,
        lastName: null,
      }

      expect(User.getTitle(user)).toEqual(mockUserData.email)
    })
  })

  describe('method: getName', () => {
    it('should return correct name based on props', () => {
      expect(User.getName(mockUserData)).toEqual('Jon Doe')
    })

    it('should return correct name based if lastName are not provided', () => {
      const user = {
        ...mockUserData,
        lastName: null,
      }

      expect(User.getName(user)).toEqual('Jon')
    })

    it('should return correct name if firstName is not provided', () => {
      const user = {
        ...mockUserData,
        firstName: null,
      }

      expect(User.getName(user)).toEqual('Doe')
    })

    it('should return correct name in case of firstName and lastName are not provided', () => {
      const user = {
        ...mockUserData,
        firstName: null,
        lastName: null,
      }

      expect(User.getName(user)).toEqual('User')
    })
  })
})
