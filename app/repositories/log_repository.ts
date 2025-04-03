import Log from '#models/log'
import LogsPresenter from '#presenters/logs_presenter'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'

/**
 * LogRepository centralizes database operations for logs.
 * Enables reusing query logic between API (/api/logs) and
 * frontend (/logs). The getAllLogsHosts and getDistinctField
 * functions are specifically designed for the frontend page,
 * allowing for cleaner code in the controller.
 */

interface LogFilter {
  page?: number
  perPage?: number
  type?: string
  search?: string
  from?: Date
  to?: Date
  order?: 'asc' | 'desc'
  group?: string
  idHost?: string
}

@inject()
export class LogRepository {
  constructor(private logsPresenter: LogsPresenter) {}

  async getAll(filter: LogFilter) {
    const {
      page = 1,
      perPage = env.get('DEFAULT_LOGS_COUNT_PER_PAGE'),
      type,
      search,
      from,
      to,
      order = 'desc',
      group,
      idHost,
    } = filter

    let query = Log.query()

    if (type) {
      query = query.where('type', type)
    }

    if (search) {
      query = query.whereLike('content', `%${search}%`)
    }

    if (from) {
      const dateTime = DateTime.fromJSDate(from)
      query = query.where('date_log', '>=', dateTime.toSQL() as string)
    }

    if (to) {
      const dateTime = DateTime.fromJSDate(to).endOf('day')
      query = query.where('date_log', '<=', dateTime.toSQL() as string)
    }

    if (idHost) {
      query = query.where('id_host', idHost)
    }

    if (group) {
      query = query.whereLike('group', group)
    }

    query = query.orderBy('date_log', order)
    query = query.preload('hostInfos')

    const logs = await query.paginate(page, perPage)

    return this.logsPresenter.serializePaginateLogsWithHostInfos(logs)
  }

  async getAllLogsHosts() {
    const listIds = await Log.query().select('id_host').distinct().preload('hostInfos')

    const serializedLogs = listIds.map((log) => {
      return {
        idHost: log.idHost,
        name: log.hostInfos?.name || null,
      }
    })

    return serializedLogs
  }

  async getDistinctField(field: string) {
    const fields = await Log.query().distinct(field)
    const serializedFields = fields
      .map((oneField) => (oneField as unknown as { [key: string]: string })[field])
      .filter((oneField) => oneField !== null)
    return serializedFields
  }
}
