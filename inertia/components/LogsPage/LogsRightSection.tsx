import { DateTime } from 'luxon'
import CodeBlock from './CodeBlock'
import { Log } from './LogsTableColumns'
interface LogsRightSectionProps {
  selectedLog: Log | undefined
}
const LogsRightSection = ({ selectedLog }: LogsRightSectionProps) => {
  if (selectedLog === undefined) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-lg font-semibold text-center opacity-40">Aucun log séléctionné</p>
        <p className="text-center opacity-40">Sélectionnez un log pour afficher les détails</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-4 p-6 min-w-[250px] overflow-y-auto custom-scrollbar">
      <h2 className="text-lg font-semibold text-white">Détail du log</h2>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="">Date :</label>
        <p>
          {DateTime.fromJSDate(new Date(selectedLog.dateLog))
            .setZone('Europe/Paris')
            .setLocale('fr')
            .toLocaleString(DateTime.DATETIME_FULL)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="">Id de l'host :</label>
        <p>{selectedLog.idHost}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="">Nom du host :</label>
        <p>{selectedLog.hostInfos?.name}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="">Groupe :</label>
        <p className="capitalize">{selectedLog.group}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="">Type :</label>
        <p className="capitalize">{selectedLog.type}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="">Contenu :</label>
        <CodeBlock content={selectedLog.content} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="">Informations additionnelles :</label>
        <CodeBlock content={selectedLog.additional || ''} />
      </div>
    </div>
  )
}

export default LogsRightSection
