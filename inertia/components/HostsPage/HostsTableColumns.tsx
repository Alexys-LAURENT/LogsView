import HostsController from '#controllers/hosts_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Link } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { DeleteHostAlertDialog } from './DeleteHostAlertDialog'
// This type is used to define the shape of our data.

// Extrait le type d'une seule entité du tableau
type Host = NonNullable<InferPageProps<HostsController, 'index'>['hosts']>[number]

export const hostsTableColumns: ColumnDef<Host>[] = [
  {
    accessorKey: 'idHost',
    header: 'Host',
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Nom',
    enableHiding: false,
  },
  {
    id: 'host-actions',
    enableHiding: false,

    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end gap-2 ">
          <Link
            title="Modifier"
            href={`/hosts?update=true&host=${row.original.idHost}&name=${row.original.name}`}
          >
            <Button variant={'outline'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </Button>
          </Link>
          <DeleteHostAlertDialog host={row.original} />
        </div>
      )
    },
  },
]
