import Host from '#models/host'

type HostJson = {
  idHost: string
  name: string
  createdAt: string
  updatedAt: string
}

/**
 * A presenter help to transform data and types it in order to be used in the frontend.
 * Thanks to this, the frontend can easily understand the data types and use them.
 */

export default class HostsPresenter {
  toJson(hosts: Host) {
    return hosts.serialize() as HostJson
  }

  toArrayJson(hosts: Host[]) {
    return hosts.map((host) => host.serialize() as HostJson)
  }
}
