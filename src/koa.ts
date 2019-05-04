import cors from '@koa/cors'
import Koa from 'koa'
import Router from 'koa-router'
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
  // TODO: Root body
  ctx.body =
    `
Hi there
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
  const stream = new IterStream(fizzbuzz)
  ctx.body = stream
})
