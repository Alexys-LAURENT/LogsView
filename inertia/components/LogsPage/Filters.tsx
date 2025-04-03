import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SharedProps } from '@adonisjs/inertia/types'
import { router, usePage } from '@inertiajs/react'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Combobox } from '../ComboBox'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { DatePickerWithRange } from './DateRangePicker'

interface FiltersInterface {
  hosts: {
    idHost: string
    name: string | null
  }[]
  groups: string[]
}

type Form = {
  search: string
  date: DateRange
  order: string
  type: string
  idHost: string
  group: string
}

const LogsPageUrl = '/logs'

const Filters = ({ hosts, groups }: FiltersInterface) => {
  const qs = usePage<SharedProps>().props.qs

  const [form, setForm] = useState<Form>({
    search: qs.search || '',
    date: {
      from: qs.from ? new Date(qs.from) : undefined,
      to: qs.to ? new Date(qs.to) : undefined,
    } as DateRange,
    order: qs.order || '',
    type: qs.type || '',
    idHost: qs.idHost || '',
    group: qs.group || '',
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    let data: Record<string, any> = {}

    // Gérer tous les champs simples
    if (form.search) data.search = form.search
    if (form.order) data.order = form.order
    if (form.type) data.type = form.type
    if (form.idHost) data.idHost = form.idHost
    if (form.group) data.group = form.group

    // Gérer le cas spécial de la date
    if (form.date?.from) {
      data.from = DateTime.fromJSDate(form.date.from).toFormat('yyyy-MM-dd')

      if (form.date.to) {
        // Si une date de fin est spécifiée, l'utiliser
        data.to = DateTime.fromJSDate(form.date.to).toFormat('yyyy-MM-dd')
      } else {
        // Sinon, utiliser la même date en precisant la fin de la journée
        data.to = DateTime.fromJSDate(form.date.from).endOf('day').toFormat('yyyy-MM-dd HH:mm:ss')
      }
    }

    router.visit(LogsPageUrl, {
      data: data,
    })
  }

  const resetAll = () => {
    router.visit(LogsPageUrl)
  }

  const formatedHosts = hosts.map((host) => ({
    label: host.name ? host.name + ' (' + host.idHost + ')' : host.idHost,
    value: host.idHost,
  }))

  const formatedGroups = groups.map((group) => ({
    label: group,
    value: group,
  }))

  // check on qs instead of form to avoid re-rendering
  const amountOfFiltersApplied = [
    qs.search,
    qs.from,
    qs.to,
    qs.order,
    qs.type,
    qs.idHost,
    qs.group,
  ].filter(Boolean).length

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="filtres" defaultChecked>
        <AccordionTrigger className="py-2 data-[state=closed]:delay-150 px-4 data-[state=open]:rounded-t-md data-[state=closed]:rounded-md bg-bg_secondary border-[1px] border-white/10">
          <div className="flex items-center gap-2">
            Filtres :
            <span className="text-main_color">
              {amountOfFiltersApplied > 0 ? `(${amountOfFiltersApplied})` : ''}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className=" p-4 rounded-b-md bg-bg_secondary border-[1px] border-white/10">
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-[repeat(auto-fill,17rem)] gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="">Contient :</label>
                <Input
                  value={form.search}
                  onChange={(e) => setForm({ ...form, search: e.target.value })}
                  placeholder="Rechercher du texte"
                  className="!border-white/10"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Date :</label>
                <DatePickerWithRange
                  date={form.date}
                  setDate={(date) => setForm({ ...form, date })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Ordre :</label>
                <Select
                  value={form.order}
                  onValueChange={(value) => setForm({ ...form, order: value })}
                >
                  <SelectTrigger className="border-[1px] border-white/10">
                    <SelectValue placeholder="Sélectionnez un ordre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc" className="uppercase">
                      Asc
                    </SelectItem>
                    <SelectItem value="desc" className="uppercase">
                      Desc
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Type :</label>
                <Combobox
                  value={form.type}
                  setValue={(value) => setForm({ ...form, type: value })}
                  data={[
                    { label: 'Info', value: 'info' },
                    { label: 'Success', value: 'success' },
                    { label: 'Error', value: 'error' },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Host :</label>
                <Combobox
                  allowFilteringInLabel
                  value={form.idHost}
                  setValue={(value) => setForm({ ...form, idHost: value })}
                  data={formatedHosts}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Groupe :</label>
                <Combobox
                  value={form.group}
                  setValue={(value) => setForm({ ...form, group: value })}
                  data={formatedGroups}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Button onClick={() => resetAll()} size={'sm'}>
                Retirer tout
              </Button>
              <Button
                onClick={(e) => handleSubmit(e)}
                type="submit"
                size={'sm'}
                className="text-white !bg-main_color hover:!opacity-90"
              >
                Appliquer
              </Button>
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default Filters
