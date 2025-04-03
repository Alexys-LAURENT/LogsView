import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Log from './log.js'

export default class Host extends BaseModel {
  @column({ isPrimary: true })
  declare idHost: string

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Log, {
    foreignKey: 'idHost',
    localKey: 'idHost',
  })
  declare logs: HasMany<typeof Log>
}
