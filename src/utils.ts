import { Readable } from 'stream'

export const limit: <T>(
  iter: IterableIterator<T>,
  upper: number
) => IterableIterator<T> = function*(iter, upper) {
  for (let i = 0; i < upper; i++) {
    const next = iter.next()

    if (next.done) break
    else yield next.value
  }
}

export class IterStream<T> extends Readable {
  private _iter: IterableIterator<T>
  private _newline: boolean

  constructor(iter: IterableIterator<T>, newline?: boolean) {
    super()

    this._iter = iter
    this._newline = newline === undefined ? true : newline
  }

  public _read() {
    const next = this._iter.next()
    const value = next.value

    const newline = this._newline ? '\n' : ''

    if (next.done) return this.push(null)
    else this.push(`${value}${newline}`)
  }
}
