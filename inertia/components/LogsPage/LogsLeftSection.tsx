import LogController from '#controllers/log_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Dispatch, SetStateAction, useState } from 'react'
import { DataTable } from '../Data-Table'
import Filters from './Filters'
import LegendTypesLogsTable from './LegendTypesLogsTable'
import { Log, logsTableColumns } from './LogsTableColumns'
import SwitchRealTime from './SwitchRealTime'

interface LogsLeftSectionProps {
  logs: InferPageProps<LogController, 'index'>['logs']
  setSelectedLog: Dispatch<SetStateAction<Log | undefined>>
  hosts: {
    idHost: string
    name: string | null
  }[]
  groups: string[]
}

const LogsLeftSection = ({ logs, setSelectedLog, hosts, groups }: LogsLeftSectionProps) => {
  const [logsState, setLogsState] = useState(logs.data)
  return (
    <div className="flex flex-col h-full gap-4 p-6 min-w-[300px]">
      <SwitchRealTime setLogsState={setLogsState} />
      <Filters groups={groups} hosts={hosts} />
      <DataTable
        columns={logsTableColumns}
        data={logsState}
        allowRowSelection
        showHideColumns
        showPagination
        paginationProps={{
          href: '/logs',
          meta: logs?.meta!,
          includeCurrentQs: true,
        }}
        legend={<LegendTypesLogsTable />}
        onRowSelectionChange={setSelectedLog}
      />
    </div>
  )
}

export default LogsLeftSection
