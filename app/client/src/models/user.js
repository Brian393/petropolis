export default class User {
  constructor(username, email, password, firstName, lastName, relatedRoleID) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.relatedRoleID = relatedRoleID;
  }
}
