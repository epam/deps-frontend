
class Permission {
  constructor ({
    roles,
    sendInvitation,
    requireSignIn,
    recipientsEmails,
  }) {
    this.roles = roles
    this.requireSignIn = requireSignIn
    this.sendInvitation = sendInvitation
    this.recipients = recipientsEmails.map((email) => ({ email }))
  }
}

export {
  Permission,
}
