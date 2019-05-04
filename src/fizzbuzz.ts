export function* fizzBuzz(start: number = 1) {
  while (true) {
    let out = ''

    if (start % 3 === 0) out += 'Fizz'
    if (start % 5 === 0) out += 'Buzz'
    yield out === '' ? start : out
    start++
  }
}
