import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { LogType } from '../models/log.js'

export const logStoreValidator = vine.compile(
  vine.object({
    idHost: vine.string().trim().uuid(),
    content: vine.string().trim().minLength(1),
    additional: vine.string().trim().nullable().optional(),
    type: vine.enum(LogType),
    group: vine.string().trim().nullable().optional(),
  })
)

export const getLogsQSValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
    type: vine.enum(LogType).optional(),
    search: vine.string().trim().minLength(1).optional(),
    from: vine.date({ formats: ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'] }).optional(),
    to: vine.date({ formats: ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'] }).optional(),
    order: vine.enum(['asc', 'desc']).optional(),
    group: vine.string().trim().minLength(1).optional(),
    idHost: vine.string().trim().uuid().optional(),
  })
)
getLogsQSValidator.messagesProvider = new SimpleMessagesProvider({
  date: 'The {{ field }} field must be formatted as YYYY-MM-DD or YYYY-MM-DD HH:mm:ss',
})
