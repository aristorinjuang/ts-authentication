import Email from '../valueobject/Email';
import Name from '../valueobject/Name';
import Password from '../valueobject/Password';

export default class User {
  private _email: Email;
  private _name: Name;
  private _password: Password;

  constructor(email: Email, name: Name, password: Password) {
    this._email = email;
    this._name = name;
    this._password = password;
  }

  public get email(): Email {
    return this._email;
  }

  public get name(): Name {
    return this._name;
  }

  public get password(): Password {
    return this._password;
  }
}