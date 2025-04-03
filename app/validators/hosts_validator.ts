import vine from '@vinejs/vine'

export const insertHostValidator = vine.compile(
  vine.object({
    idHost: vine.string().minLength(1),
    name: vine.string().minLength(1),
  })
)

export const updateParamsValidator = vine.compile(
  vine.object({
    idHost: vine.string().minLength(1),
  })
)

export const updateBodyValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1),
  })
)

export const deleteHostValidator = vine.compile(
  vine.object({
    idHost: vine.string(),
  })
)
