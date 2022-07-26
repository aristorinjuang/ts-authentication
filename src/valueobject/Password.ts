import bcrypt from 'bcrypt';

export default class Password {
  private _salt: string;
  private _hash: string;

  constructor(salt: string = '', hash: string = '') {
    this._salt = salt;
    if (this._salt === '') {
      this._salt = bcrypt.genSaltSync();
    }
    this._hash = hash;
  }

  public get salt(): string {
    return this._salt;
  }

  public get hash(): string {
    return this._hash;
  }

  public set hash(password: string) {
    this._hash = bcrypt.hashSync(password, this._salt);
  }

  public verify(password: string): boolean {
    return bcrypt.compareSync(password, this._hash);
  }
}