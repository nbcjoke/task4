module.exports = class UserDto {
  email;
  name;
  status;
  registrationTime;
  _id;
  lastOnline;

  constructor(model) {
    this.email = model.email;
    this.name = model.name;
    this.status = model.status;
    this.registrationTime = model.registrationTime;
    this._id = model._id;
    this.lastOnline = model.lastOnline;
  }
};
