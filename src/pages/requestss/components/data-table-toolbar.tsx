import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { RequestStatus } from '@/schemas/requestsschema'
// import { DataTableFacetedFilter } from './data-table-faceted-filter'


export interface FilterProps {
  key: string;
  placeholder: string;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>; // Replace `any` with the actual type of `table` if you know it.
  filter: FilterProps;
  viewActions?: Record<string, () => void>
}

export function DataTableToolbar<TData>({
  table,
  filter,
  viewActions
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder={filter.placeholder}
          value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(filter.key)?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={RequestStatus.options}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} viewActions={viewActions} />
    </div>
  )
}
