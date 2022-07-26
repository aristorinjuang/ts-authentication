import Repository from './Repository';
import Email from '../valueobject/Email';
import Name from '../valueobject/Name';
import Password from '../valueobject/Password';
import User from '../entity/User';

export default class ResolvedRepositoryMock implements Repository {
  public async get(email: Email): Promise<User> {
    return new Promise<User>((resolve) => {
      let name: Name = new Name('John', 'Doe');
      let password: Password = new Password('$2b$10$WCZ6j4PLICecyCYvBvL7We');

      password.hash = 'password';

      let user: User = new User(email, name, password);

      resolve(user);
    })
  }

  public async create(_: User): Promise<void> {
  }
}