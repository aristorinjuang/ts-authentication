import Repository from './Repository';
import Email from '../valueobject/Email';
import User from '../entity/User';

export default class RejectedRepositoryMock implements Repository {
  public async get(_: Email): Promise<User> {
    return new Promise<User>((_, reject) => {
      reject(new Error());
    })
  }

  public async create(_: User): Promise<void> {
    return new Promise<void>((_, reject) => {
      reject(new Error());
    })
  }
}