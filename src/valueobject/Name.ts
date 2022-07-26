export default class Name {
  private _first: string;
  private _last: string;

  constructor(first: string, last: string = '') {
    this._first = first;
    this._last = last;
  }

  public get first(): string {
    return this._first;
  }

  public get last(): string {
    return this._last;
  }

  public full(): string {
    if (this._last === '') {
      return this._first;
    }
    return this._first + ' ' + this._last;
  }
}