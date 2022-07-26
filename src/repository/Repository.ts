import Email from '../valueobject/Email';
import User from '../entity/User';

export default interface Repository {
  get(email: Email): Promise<User>
  create(user: User): Promise<void>
}