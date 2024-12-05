import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [mode, setMode] = React.useState<'default' | 'year' | 'month'>('default')
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState<number>(new Date().getMonth())

  const years = Array.from({ length: 110 }, (_, i) => new Date().getFullYear() - 100 + i)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleHeaderClick = () => {
    setMode(prevMode => {
      if (prevMode === 'default') return 'year'
      if (prevMode === 'year') return 'month'
      return 'default'
    })
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year))
    setMode('month')
  }

  const handleMonthChange = (month: string) => {
    setSelectedMonth(months.indexOf(month))
    setMode('default')
  }

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, 1)
    setSelectedYear(newDate.getFullYear())
    setSelectedMonth(newDate.getMonth())
  }

  const goToNextMonth = () => {
    const newDate = new Date(selectedYear, selectedMonth + 1, 1)
    setSelectedYear(newDate.getFullYear())
    setSelectedMonth(newDate.getMonth())
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium cursor-pointer',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <IconChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <IconChevronRight className="h-4 w-4" {...props} />,
        Caption: ({ displayMonth }) => (
          <div className="flex justify-center items-center space-x-1">
            <button
              onClick={goToPreviousMonth}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
              )}
              aria-label="Go to previous month"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {mode === 'default' && (
              <div onClick={handleHeaderClick} className="cursor-pointer w-full text-center">
                {displayMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            )}
            {mode === 'year' && (
              <Select onValueChange={handleYearChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {mode === 'month' && (
              <Select onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <button
              onClick={goToNextMonth}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
              )}
              aria-label="Go to next month"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        ),
      }}
      month={new Date(selectedYear, selectedMonth)}
      onMonthChange={(newMonth) => {
        setSelectedYear(newMonth.getFullYear())
        setSelectedMonth(newMonth.getMonth())
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }