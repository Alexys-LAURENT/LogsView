import LogController from '#controllers/log_controller'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { InferPageProps } from '@adonisjs/inertia/types'
import { useState } from 'react'
import LayoutContextProviders from '~/components/LayoutContextProviders'
import LayoutPages from '~/components/LayoutPages'
import LogsLeftSection from '~/components/LogsPage/LogsLeftSection'
import LogsRightSection from '~/components/LogsPage/LogsRightSection'
import { Log } from '../components/LogsPage/LogsTableColumns'

const defaultSizeLeft = 70
const defaultSizeRight = 30

// props received from the route controller (Adonis)
const LogsPage = (props: InferPageProps<LogController, 'index'>) => {
  const { groups, hosts, logs } = props

  const [selectedLog, setSelectedLog] = useState<Log>()
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 w-full border ">
      <ResizablePanel
        defaultSize={defaultSizeLeft}
        // window.innerHeight - navbar - topbar
        className="min-w-[15px] h-[calc(100svh-57px-65px)] max-h-[calc(100svh-57px-65px)]"
      >
        <LogsLeftSection
          groups={groups}
          hosts={hosts}
          logs={logs}
          setSelectedLog={setSelectedLog}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultSizeRight}
      // window.innerHeight - navbar - topbar
      className="min-w-[15px] h-[calc(100svh-57px-65px)] max-h-[calc(100svh-57px-65px)]"
      >
        <LogsRightSection selectedLog={selectedLog} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default LogsPage

LogsPage.layout = (page: any) => (
  <LayoutContextProviders>
    <LayoutPages children={page} />
  </LayoutContextProviders>
)
