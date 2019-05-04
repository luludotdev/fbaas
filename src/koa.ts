import cors from '@koa/cors'
import Koa from 'koa'
import Router from 'koa-router'
import { fizzBuzz } from './fizzbuzz'

export const koa = new Koa()
const router = new Router()
koa.use(router.routes()).use(router.allowedMethods())

router.get('/', ctx => {
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

  if (end - start > 100000) return ctx.throw(400)
  ctx.status = 200

  const fizzbuzz = fizzBuzz(start)
  for (let i = 0; i <= end - start; i++) {
    ctx.res.write(`${fizzbuzz.next().value}\n`)
  }

  ctx.res.end()
})
