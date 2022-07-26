import Name from './Name';

describe('name value object', () => {
  let name: Name = new Name('John', 'Doe');

  test('first name of "John" should be "John"', () => {
    expect(name.first).toBe('John');
  })

  test('last name of "Doe" should be "Doe"', () => {
    expect(name.last).toBe('Doe');
  })

  test('full name of "John Doe" should be "John Doe"', () => {
    expect(name.full()).toBe('John Doe')
  })

  test('full name of "John" should be "John"', () => {
    let name: Name = new Name('John');

    expect(name.full()).toBe('John')
  })
})