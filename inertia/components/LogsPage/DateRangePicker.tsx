import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface DatePickerWithRange {
  date?: DateRange | undefined
  setDate?: (date: DateRange) => void
  className?: string
}

export function DatePickerWithRange({ className, setDate, date }: DatePickerWithRange) {
  const [ownDate, setOwnDate] = useState<DateRange | undefined>(date ? date : undefined)

  useEffect(() => {
    setOwnDate(date ? date : undefined)
  }, [date])

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal border-[1px] border-white/10',
              !ownDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {ownDate?.from ? (
              ownDate.to ? (
                <>
                  {format(ownDate.from, 'LLL dd, y')} - {format(ownDate.to, 'LLL dd, y')}
                </>
              ) : (
                format(ownDate.from, 'LLL dd, y')
              )
            ) : (
              <span>Sélectionnez une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            classNames={{
              day_selected: 'bg-main_color',
              day_range_middle: '!bg-bg_tertiary text-white',
            }}
            initialFocus
            mode="range"
            defaultMonth={ownDate?.from}
            selected={ownDate}
            onSelect={
              setDate
                ? (setDate as React.Dispatch<React.SetStateAction<DateRange | undefined>>)
                : setOwnDate
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
