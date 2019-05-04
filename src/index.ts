import cluster, { fork, isMaster } from 'cluster'
import { createServer } from 'http'
import { cpus } from 'os'
import { PORT } from './env'
import { koa } from './koa'
import signale from './signale'

const cores = cpus().length
const maxWorkers = 4
const workers = Math.min(cores, maxWorkers)

if (isMaster) {
  signale.start('master process started...')
  signale.info(`listening on port ${PORT}`)
  for (let i = 0; i < workers; i++) fork()

  cluster.on('exit', worker => {
    signale.error(`worker ${worker.id} [${worker.process.pid}] failed!`)
    cluster.fork()
  })

  cluster.on('fork', worker => {
    signale.start(`worker ${worker.id} started [${worker.process.pid}]`)
  })
} else {
  createServer(koa.callback()).listen(PORT)
}
