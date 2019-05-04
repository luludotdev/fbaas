import { isMaster, worker } from 'cluster'
import { Signale } from 'signale'

export const signale = new Signale({
  scope: isMaster ? 'master' : worker.id.toString(),
})
export default signale
