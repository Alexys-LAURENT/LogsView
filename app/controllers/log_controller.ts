import LogsPresenter from '#presenters/logs_presenter'
import { LogRepository } from '#repositories/log_repository'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import transmit from '@adonisjs/transmit/services/main'
import { errors } from '@vinejs/vine'
import { DateTime } from 'luxon'
import Log from '../models/log.js'
import { getLogsQSValidator, logStoreValidator } from '../validators/logs_validators.js'

@inject()
export default class LogController {
  constructor(
    private logRepository: LogRepository,
    private logsPresenter: LogsPresenter
  ) {}

  async index({ inertia, request, response }: HttpContext) {
    try {
      const validQs = await getLogsQSValidator.validate(request.qs())
      const groupColumnName = 'group'
      const [groups, hosts, logs] = await Promise.all([
        this.logRepository.getDistinctField(groupColumnName),
        this.logRepository.getAllLogsHosts(),
        this.logRepository.getAll(validQs),
      ])
      return inertia.render('Logs', {
        logs: logs,
        groups: groups,
        hosts: hosts,
      })
    } catch (error) {
      console.error('log_controller::index ', error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        response.redirect('/logs')
        return
      }
      throw new Error("Une erreur est survenue lors de l'affichage de la page de logs", error)
    }
  }

  async get({ request, response }: HttpContext) {
    try {
      const validQs = await getLogsQSValidator.validate(request.qs())
      const logs = await this.logRepository.getAll(validQs)
      return response.json(logs)
    } catch (error) {
      console.error('log_controller::get ', error)
      return response.status(500).json({
        error: 'Une erreur est survenue lors de la récupération des logs',
        messages: error.messages,
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const logData = await request.validateUsing(logStoreValidator)
      const today = DateTime.utc()

      const log = await Log.create({
        idHost: logData.idHost,
        dateLog: today,
        content: logData.content,
        additional: logData.additional,
        type: logData.type,
        group: logData.group,
      })

      const sendNewLogToFrontInRealTime = async (idLog: number) => {
        const newLogWithHostInfos = this.logsPresenter.serializeLogWithHostInfos(
          await Log.query().where('idLog', idLog).preload('hostInfos').firstOrFail()
        )
        transmit.broadcast('logs_realtime', JSON.stringify(newLogWithHostInfos))
      }
      // By doing this, we send the new log to the frontend in real time without impacting the response time of the store request
      sendNewLogToFrontInRealTime(log.idLog)

      return response.status(201).json({ success: true, logId: log.idLog })
    } catch (error) {
      if (error.messages) {
        return response.status(400).json({ errors: error.messages })
      }
      console.error('Erreur lors du stockage du log:', error)
      return response
        .status(500)
        .json({ error: 'Erreur serveur lors du stockage du log', messages: error.messages })
    }
  }
}
