import type { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const Login = () => {
  const sharedProps = usePage<SharedProps>().props
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
      <h1 className="text-xl font-semibold">Logs View</h1>
      <form action="api/login" className="flex flex-col w-3/4 p-4 lg:w-1/4" method="post">
        <Input
          type="password"
          placeholder="Entrez le code d'accès"
          name="password"
          className="p-2 mb-4 bg-secondary border-[1px] border-white/10"
        />
        <Button
          type="submit"
          className="p-2 text-white rounded bg-main_color hover:bg-main_color hover:opacity-80"
        >
          Se connecter
        </Button>
      </form>
      {sharedProps.qs.error && <p className="mt-4 text-red-500">{sharedProps.qs.error}</p>}
    </div>
  )
}

export default Login
