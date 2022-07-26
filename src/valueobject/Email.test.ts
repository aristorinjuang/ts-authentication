import Email from './Email';

describe('email value object', () => {
  let email: Email = new Email('test@example.com');

  test('email local of "test" should be "test"', () => {
    expect(email.local).toBe('test');
  })

  test('email domain of "example.com" should be "example.com"', () => {
    expect(email.domain).toBe('example.com');
  })

  test('email of "test@example.com" should be "test@example.com"', () => {
    expect(email.string()).toBe('test@example.com');
  })
})