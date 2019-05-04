import { isMaster, worker } from 'cluster'
import { Middleware } from 'koa'

export const info: Middleware = async (ctx, next) => {
  const workerID = isMaster ? 'M' : worker.id.toString()
  ctx.response.set('x-worker-id', workerID)

  if (process.env.HOSTNAME) ctx.response.set('x-hostname', process.env.HOSTNAME)
  await next()
}
