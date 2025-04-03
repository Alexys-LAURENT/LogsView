import { Head } from '@inertiajs/react'
import LayoutContextProviders from '~/components/LayoutContextProviders'
import LayoutPages from '~/components/LayoutPages'
export default function Home() {
  return (
    <>
      <Head title="Homepage" />
      homepage
    </>
  )
}

Home.layout = (page: any) => (
  <LayoutContextProviders>
    <LayoutPages children={page} />
  </LayoutContextProviders>
)
