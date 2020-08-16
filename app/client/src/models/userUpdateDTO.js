export default class UserUpdateDTO {
  constructor(id, username, email, firstName, lastName, relatedRoleID) {
    this.userID = id;
    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.relatedRoleID = relatedRoleID;
  }
}
