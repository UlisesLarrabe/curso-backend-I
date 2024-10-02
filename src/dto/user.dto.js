export class UserDTO {
  constructor(user) {
    this.name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
  }
}
