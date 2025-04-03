import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_log')
      table.text('additional').nullable()
      table.text('content').notNullable()
      table.dateTime('date_log').notNullable()
      table.string('group').nullable()
      table.string('id_host').notNullable()
      table.enum('type', ['info', 'error', 'success']).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
