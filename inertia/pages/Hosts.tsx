import HostsController from '#controllers/hosts_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { DataTable } from '~/components/Data-Table'
import FormHost from '~/components/HostsPage/FormHost'
import { hostsTableColumns } from '~/components/HostsPage/HostsTableColumns'
import LayoutContextProviders from '~/components/LayoutContextProviders'
import LayoutPages from '~/components/LayoutPages'
const HostsPage = (props: InferPageProps<HostsController, 'index'>) => {
  const { hosts } = props

  return (
    <div className="flex justify-center w-full ">
      <div className="mt-8 flex flex-col px-4 sm:px-0 w-full sm:w-4/5 gap-8 lg:w-1/2 max-w-[800px]">
        <FormHost />

        <DataTable columns={hostsTableColumns} data={hosts!} />
      </div>
    </div>
  )
}

export default HostsPage

HostsPage.layout = (page: any) => (
  <LayoutContextProviders>
    <LayoutPages children={page} />
  </LayoutContextProviders>
)
