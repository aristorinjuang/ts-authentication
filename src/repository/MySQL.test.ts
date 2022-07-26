import mysql, { Connection } from 'mysql';
import sinon, { SinonMock } from 'sinon';
import Repository from './Repository';
import MySQL from './MySQL';
import User from '../entity/User';
import Email from '../valueobject/Email';
import Name from '../valueobject/Name';
import Password from '../valueobject/Password';

describe('user MySQL repository', () => {
  let connection: Connection = mysql.createConnection({host: 'localhost'});
  let mock: SinonMock = sinon.mock(connection);
  let repository: Repository = new MySQL(connection);
  let email: Email = new Email('test@example.com');
  let name: Name = new Name('John', 'Doe');
  let password: Password = new Password('password', 'existing');

  it('should return a registered user', async () => {
    mock.expects('query')
      .withArgs('SELECT first_name, last_name, salt, hash FROM users WHERE email = ? LIMIT 1')
      .callsArgWith(
        2,
        null,
        [{first_name: 'John', last_name: 'Doe', salt: 'existing', hash: 'hashed'}],
        ['first_name', 'last_name', 'salt', 'hash']
      )

      let user: User = await repository.get(email);

      expect(user.email.string()).toBe(email.string());
      expect(user.name.full()).toBe('John Doe');
  })

  it('should return an error when got failed to get an user', async () => {
    mock.expects('query').once().callsArgWith(2, new Error(), null, null);

    try {
      await repository.get(email);
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
    }
  })

  it('should create an user', () => {
    mock.expects('query').withArgs('INSERT INTO users (email, first_name, last_name, salt, hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())');

    repository.create(new User(email, name, password))
  })

  it('should return an error when got failed to create an user', async () => {
    mock.expects('query').once().callsArgWith(2, new Error(), null, null);

    try {
      await repository.create(new User(email, name, password));
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
    }
  })
})