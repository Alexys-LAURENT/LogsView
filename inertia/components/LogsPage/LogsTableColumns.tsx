import LogController from '#controllers/log_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import { logsTypeColors } from './LegendTypesLogsTable'

// This type is used to define the shape of our data.
export type Log = NonNullable<InferPageProps<LogController, 'index'>['logs']>['data'][number]

export const logsTableColumns: ColumnDef<Log>[] = [
  {
    accessorKey: 'type',
    header: '',
    enableHiding: false,
    cell: ({ row }) => (
      <div className={`w-1 h-5 rounded-full opacity-50 ${logsTypeColors[row.original.type]}`}></div>
    ),
  },
  {
    id: 'Host',
    accessorKey: 'host',
    header: 'Host',
    cell: ({ row }) => (
      <span className="text-ellipsis line-clamp-2">
        {row.original.hostInfos?.name || row.original.idHost}
      </span>
    ),
  },
  {
    id: 'Date',
    accessorKey: 'dateLog',
    header: 'Date',
    cell: ({ row }) => (
      <span className="text-ellipsis line-clamp-2 min-w-[120px]">
        {DateTime.fromJSDate(new Date(row.original.dateLog))
          .setZone('Europe/Paris')
          .setLocale('fr')
          .toLocaleString(DateTime.DATETIME_FULL)}
      </span>
    ),
  },
  {
    id: 'Content',
    accessorKey: 'content',
    header: 'Content',
    cell: ({ row }) => <span className="text-ellipsis line-clamp-2">{row.original.content}</span>,
  },
  {
    id: 'Additional',
    accessorKey: 'additional',
    header: 'Additional',
    cell: ({ row }) => (
      <span className="text-ellipsis line-clamp-2">{row.original.additional}</span>
    ),
  },
  {
    id: 'Group',
    accessorKey: 'group',
    header: 'Group',
  },
]
