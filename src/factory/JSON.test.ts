import JSON from './JSON';
import User from '../entity/User';
import Email from '../valueobject/Email';
import Name from '../valueobject/Name';
import Password from '../valueobject/Password';

describe('JSON factory', () => {
  it('should return a user on the JSON format', () => {
    let email: Email = new Email('test@example.com');
    let name: Name = new Name('John', 'Doe');
    let password: Password = new Password('$2b$10$WCZ6j4PLICecyCYvBvL7We');

    password.hash = 'password'

    let user: User = new User(email, name, password);
    let expected = {
      email: 'test@example.com',
      name: {
        first: 'John',
        last: 'Doe',
        full: 'John Doe'
      }
    };

    expect(JSON.user(user)).toMatchObject(expected);
  })
})