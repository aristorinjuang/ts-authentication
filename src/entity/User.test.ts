import Email from '../valueobject/Email';
import Name from '../valueobject/Name';
import Password from '../valueobject/Password';
import User from './User';

describe('a user contains email, name, and password', () => {
  let email: Email = new Email('test@example.com');
  let name: Name = new Name('John', 'Doe');
  let password: Password = new Password('$2b$10$WCZ6j4PLICecyCYvBvL7We');

  password.hash = 'password'

  let user: User = new User(email, name, password);

  test('user with email "test@example.com" should be "test@example.com"', () => {
    expect(user.email.string()).toBe('test@example.com');
  })

  test('user with name "John Doe" should be "John Doe"', () => {
    expect(user.name.full()).toBe('John Doe');
  })

  test('user can verify the password', () => {
    expect(user.password.verify('password')).toBeTruthy();
  })
})