import User from '../../entity/User';

export default class JSON {
  public static user = (user: User) => {
    return {
      email: user.email.string(),
      name: {
        first: user.name.first,
        last: user.name.last,
        full: user.name.full()
      }
    };
  }
}