import { isMaster, worker } from 'cluster'
import { Signale } from 'signale'

export const signale = new Signale({
  config: {
    displayDate: true,
    displayTimestamp: true,
  },
  scope: isMaster ? 'M' : worker.id.toString(),
})

export default signale
