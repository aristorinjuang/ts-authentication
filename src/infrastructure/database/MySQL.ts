import User from '../../entity/User';
import Email from '../../valueobject/Email';
import Name from '../../valueobject/Name';
import Password from '../../valueobject/Password';
import Repository from '../../repository/Repository';
import { Connection, MysqlError } from 'mysql';

export default class MySQL implements Repository {
  private _connection: Connection;

  constructor(connection: Connection) {
    this._connection = connection;
  }

  public async get(email: Email): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      let user: User;
      this._connection.query(
        'SELECT first_name, last_name, salt, hash FROM users WHERE email = ? LIMIT 1',
        [email.string()],
        (err: MysqlError | null, result: any) => {
          if (err) {
            reject(err)
          }

          if (result !== undefined && result !== null && result.length) {
            let name: Name = new Name(result[0].first_name, result[0].last_name);
            let password: Password = new Password(result[0].salt, result[0].hash);

            user = new User(email, name, password);
          }

          resolve(user);
        }
      )
    })
  }

  public async create(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._connection.query(
        'INSERT INTO users (email, first_name, last_name, salt, hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [user.email.string(), user.name.first, user.name.last, user.password.salt, user.password.hash],
        (err: MysqlError | null, result: any) => {
          if (err) {
            reject(err)
          }

          resolve(result);
        }
      )
    })
  }
}