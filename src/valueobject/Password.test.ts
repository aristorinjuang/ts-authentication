import Password from './Password';

describe('password value object', () => {
  let salt = '$2b$10$WCZ6j4PLICecyCYvBvL7We';
  let password: Password = new Password();
  let existing: Password = new Password(salt);

  existing.hash = 'password'

  test('salt should be defined', () => {
    expect(password.salt.length).toBeDefined()
  })

  test('salt can contain the existing one', () => {
    expect(existing.salt).toBe(salt);
  })

  test('hash should be defined', () => {
    password.hash = 'password'

    expect(password.hash).toBeDefined();
  })

  it('can verify the existing password', () => {
    let other: Password = new Password(salt);

    other.hash = 'password';

    expect(existing.verify('password')).toBeTruthy();
  })
})