import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface ComboboxInterface {
  data: { value: string; label: string }[]
  allowFilteringInLabel?: boolean
  value?: string
  setValue?: (value: string) => void
  placeholder?: string
  searchText?: string
  noDataText?: string
}

export function Combobox({
  data,
  allowFilteringInLabel = false,
  value,
  setValue,
  placeholder,
  searchText,
  noDataText,
}: ComboboxInterface) {
  const [open, setOpen] = useState(false)
  const [ownValue, setOwnValue] = useState(value ? value : '')

  useEffect(() => {
    setOwnValue(value ? value : '')
  }, [value])

  const filter = (allowFilteringInLabel: boolean, value: string, search: string): 0 | 1 => {
    if (value.toLowerCase().includes(search.toLowerCase())) return 1
    if (allowFilteringInLabel) {
      if (
        data
          .find((data) => data.value === value)
          ?.label.toLowerCase()
          .includes(search.toLowerCase())
      )
        return 1
    }
    return 0
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="border-[1px] border-white/10 justify-between"
        >
          <span className="font-normal truncate">
            {ownValue
              ? data.find((data) => data.value === ownValue)?.label
              : placeholder
                ? placeholder
                : 'Sélectionnez une valeur'}
          </span>
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 ">
        <Command
          filter={(value, search) => {
            return filter(allowFilteringInLabel, value, search)
          }}
        >
          <CommandInput placeholder={searchText ? searchText : 'Recherchez une valeur'} />
          <CommandList>
            <CommandEmpty>{noDataText ? noDataText : 'Aucune donnée trouvée'}</CommandEmpty>
            <CommandGroup>
              {data.map((data) => (
                <CommandItem
                  key={data.value}
                  value={data.value}
                  onSelect={(currentValue) => {
                    setOpen(false)
                    setOwnValue(currentValue === value ? '' : currentValue)
                    setValue && setValue(currentValue === value ? '' : currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === data.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {data.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
