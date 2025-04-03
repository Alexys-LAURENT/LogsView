// used in LogsTableColumns.tsx to show the color of the log type in the table.
export const logsTypeColors = {
  error: 'bg-red-500',
  info: 'bg-blue-500',
  success: 'bg-green-500',
}

const LegendTypesLogsTable = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="text-sm">Légende : </p>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`w-2 h-2 ${logsTypeColors.error} rounded-full opacity-50`}></span>
        <p className="text-xs">Error</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`w-2 h-2 ${logsTypeColors.info} rounded-full opacity-50`}></span>
        <p className="text-xs">Info</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`w-2 h-2 ${logsTypeColors.success} rounded-full opacity-50`}></span>
        <p className="text-xs">Success</p>
      </div>
    </div>
  )
}

export default LegendTypesLogsTable
