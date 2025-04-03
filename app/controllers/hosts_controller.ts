import Host from '#models/host'
import HostsPresenter from '#presenters/hosts_presenter'
import {
  deleteHostValidator,
  insertHostValidator,
  updateBodyValidator,
  updateParamsValidator,
} from '#validators/hosts_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HostsController {
  constructor(private presenter: HostsPresenter) {}

  async index({ inertia }: HttpContext) {
    const hosts = this.presenter.toArrayJson(await Host.all())
    return inertia.render('Hosts', {
      hosts: hosts,
    })
  }

  async create({ request, response }: HttpContext) {
    try {
      const valid = await request.validateUsing(insertHostValidator)
      const doesExist = await Host.find(valid.idHost)

      if (doesExist) {
        return response
          .status(400)
          .json({ error: true, message: `L'uuid ${valid.idHost} est déjà utilisé` })
      }

      const createdHost = await Host.create({
        idHost: valid.idHost,
        name: valid.name,
      })

      return response.status(201).json({
        success: true,
        message: 'Host crée avec succès',
        data: this.presenter.toJson(createdHost),
      })
    } catch (error) {
      console.error('hosts_controller::create ', error)
      return response
        .status(500)
        .json({ error: true, message: 'Une erreur est survenue lors de la création du host' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const validBody = await request.validateUsing(updateBodyValidator)
      const validParams = await updateParamsValidator.validate(params)

      const host = await Host.find(validParams.idHost)

      if (!host) {
        return response
          .status(404)
          .json({ error: true, message: `L'uuid ${validParams.idHost} n'existe pas` })
      }

      host.name = validBody.name

      await host.save()

      return response.status(200).json({
        success: true,
        message: `Host ${validParams.idHost} mis à jour`,
        data: this.presenter.toJson(host),
      })
    } catch (error) {
      console.error('hosts_controller::update ', error)
      return response
        .status(500)
        .json({ error: true, message: 'Une erreur est survenue lors de la mise à jour du host' })
    }
  }

  async delete({ params, response }: HttpContext) {
    try {
      const valid = await deleteHostValidator.validate(params)

      const hostToDelete = await Host.find(valid.idHost)

      if (!hostToDelete) {
        return response
          .status(404)
          .json({ error: true, message: `L'uuid ${valid.idHost} n'existe pas` })
      }

      await hostToDelete.delete()

      return response.status(200).json({ success: true, message: `Host ${valid.idHost} supprimé` })
    } catch (error) {
      console.error('hosts_controller::delete ', error)
      return response
        .status(500)
        .json({ error: true, message: 'Une erreur est survenue lors de la suppression du host' })
    }
  }
}
