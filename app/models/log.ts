import env from '#start/env'
import { BaseModel, afterSave, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Host from './host.js'

export enum LogType {
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
}

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  declare idLog: number

  @column()
  declare idHost: string

  @column.dateTime({ columnName: 'date_log' })
  declare dateLog: DateTime

  @column()
  declare content: string

  @column()
  declare additional: string | null

  @column()
  declare type: LogType

  @column()
  declare group: string | null

  @belongsTo(() => Host, {
    foreignKey: 'idHost',
    localKey: 'idHost',
  })
  declare hostInfos: BelongsTo<typeof Host>

  @afterSave()
  static async deleteOldLogs() {
    const purgeProbability = env.get('DATABASE_PURGE_PROBABILITY')

    const randomValue = Math.floor(Math.random() * purgeProbability) + 1

    if (randomValue === 1) {
      const retentionMonths = env.get('DATABASE_RETENTION_MONTHS')

      const retentionDate = DateTime.now().minus({ months: retentionMonths })

      await Log.query().where('date_log', '<', retentionDate.toSQL()).delete()

      console.log(`[Purge] Anciens logs supprimés (plus vieux que ${retentionDate.toISO()})`)
    }
  }
}
