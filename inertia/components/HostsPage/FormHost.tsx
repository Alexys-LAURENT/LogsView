import { SharedProps } from '@adonisjs/inertia/types'
import { Link, router, useForm, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useToast } from '~/contexts/ToastContext'

const hostPagePath = '/hosts'
const hostApiPath = '/api/hosts'

const FormHost = () => {
  const qs = usePage<SharedProps>().props.qs
  const { data, setData, processing, reset } = useForm({
    idHost: qs.host || '',
    name: qs.name || '',
  })

  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const isUpdate = qs.update === 'true'
    const url = isUpdate ? `${hostApiPath}/${data.idHost}` : hostApiPath
    const response = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        idHost: data.idHost,
      }),
    })
    const result = await response.json()
    if (result.success) {
      router.visit(hostPagePath)
      toast.success(result.message)
      reset()
    } else {
      const defaultMessage = 'Une erreur est survenue'
      console.error('FormHost::handleSubmit ', result.message || defaultMessage)
      toast.error(result.message || defaultMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="">Host : </label>
        <Input
          disabled={qs.update === 'true'}
          required
          name="idHost"
          value={data.idHost}
          onChange={(e) => setData('idHost', e.target.value)}
          maxLength={255}
          placeholder="Entrez l'uuid de l'host"
          className="bg-bg_secondary border-[1px] border-white/10"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Nom :</label>
        <Input
          required
          maxLength={255}
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          name="name"
          placeholder="Associez un nom à l'host"
          className="bg-bg_secondary border-[1px] border-white/10"
        />
      </div>
      <Button
        type="submit"
        disabled={processing || !data.idHost || !data.name}
        className="w-full text-white bg-main_color hover:bg-main_color hover:opacity-80"
      >
        {qs.update === 'true' ? 'Modifier' : 'Ajouter'}
      </Button>
      {qs.update === 'true' && (
        <Link href="/hosts" className="w-full ">
          <Button
            disabled={processing}
            className="w-full text-white bg-bg_tertiary hover:bg-bg_tertiary hover:opacity-80 border-[1px] border-white/10"
          >
            Annuler
          </Button>
        </Link>
      )}
    </form>
  )
}

export default FormHost
