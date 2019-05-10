import cors from '@koa/cors'
import Koa from 'koa'
import Router from 'koa-router'
import { createBrotliCompress, createDeflate, createGzip } from 'zlib'
import { fizzBuzz } from './fizzbuzz'
import { info, logger } from './middleware'
import { IterStream, limit } from './utils'

export const koa = new Koa()
const router = new Router()

koa
  .use(info)
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods())

router.get('/', ctx => {
  ctx.body =
    `
FizzBuzz as a Service

GET /
  Displays this page

GET /api/v1.0/:range
EG: /api/v1.0/0,100
  Returns a text/event-stream for the requested range.
`.trim() + '\n'
})

router.get('/api/v1.0/:range', cors(), ctx => {
  const range: string = ctx.params.range
  const ranges: number[] = range
    .split(',')
    .filter(x => x !== '')
    .map(x => parseInt(x, 10))
    .filter(x => !Number.isNaN(x))

  if (ranges.length < 2) return ctx.throw(400)
  const [start, end] = ranges
  if (start >= end) return ctx.throw(400)

  if (end - start > 1000000) return ctx.throw(400)
  ctx.status = 200

  ctx.set('Content-type', 'text/event-stream')
  const fizzbuzz = limit(fizzBuzz(start), end - start + 1)
  const iterableStream = new IterStream(fizzbuzz)

  const acceptEncodings: string[] = (
    ctx.headers['accept-encoding'] || ''
  ).split(', ')

  if (
    acceptEncodings.includes('br') &&
    typeof createBrotliCompress === 'function'
  ) {
    ctx.set('Content-encoding', 'br')
    const stream = iterableStream.pipe(createBrotliCompress())

    return (ctx.body = stream)
  } else if (acceptEncodings.includes('gzip')) {
    ctx.set('Content-encoding', 'gzip')
    const stream = iterableStream.pipe(createGzip())

    return (ctx.body = stream)
  } else if (acceptEncodings.includes('deflate')) {
    ctx.set('Content-encoding', 'deflate')
    const stream = iterableStream.pipe(createDeflate())

    return (ctx.body = stream)
  } else {
    const stream = iterableStream
    return (ctx.body = stream)
  }
})
