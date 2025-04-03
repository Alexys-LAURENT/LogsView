import Log, { LogType } from '#models/log'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

/**
 * A presenter help to transform data and types it in order to be used in the frontend.
 * Thanks to this, the frontend can easily understand the data types and use them.
 */

export default class LogsPresenter {
  serializePaginateLogsWithHostInfos(logs: ModelPaginatorContract<Log>) {
    const meta = logs.getMeta()

    return {
      meta: {
        total: meta.total as number,
        perPage: meta.perPage as number,
        currentPage: meta.currentPage as number,
        lastPage: meta.lastPage as number,
        firstPage: meta.firstPage as number,
        firstPageUrl: meta.firstPageUrl as string,
        lastPageUrl: meta.lastPageUrl as string,
        nextPageUrl: meta.nextPageUrl as string | null,
        previousPageUrl: meta.previousPageUrl as string | null,
      },
      data: logs.all().map((log) => this.serializeLogWithHostInfos(log)),
    }
  }

  serializeLogWithHostInfos(log: Log) {
    return {
      idLog: log.idLog as number,
      idHost: log.idHost as string,
      additional: log.additional as string,
      content: log.content as string,
      dateLog: log.dateLog as unknown as Date,
      group: log.group as string | null,
      type: log.type as LogType,
      hostInfos: log.$preloaded.hostInfos as unknown as {
        idHost: string
        name: string
        createdAt: string
        updatedAt: string
      } | null,
    }
  }
}
