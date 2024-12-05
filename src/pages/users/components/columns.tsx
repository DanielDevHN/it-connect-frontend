import { Column, ColumnDef, Row } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
// import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

import { labels } from '../data/data'

export const generateColumns = <T,>({
  keys,
  options,
}: {
  keys: { key: string; title: string }[];
  options: {
    id: { key: string; title: string };
    actions: Record<string, (id: number) => void>
  };
}): ColumnDef<T>[] => {
  const columns = [
  {
    accessorKey: options.id.key,
    header: ({ column }:{ column: Column<T> }) => (
      <DataTableColumnHeader column={column} title={options.id.title} />
    ),
    cell: ({ row }:{ row: Row<T> }) => <div className='w-[80px]'>{row.getValue(options.id.key)}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  ...keys.map(({ key, title }) => ({
    accessorKey: key,
    header: ({ column }:{ column: Column<T> }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }:{ row: Row<T> } ) => {
      // @ts-expect-error aaa
      const label = labels.find((label) => label.value === row.original[key]);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue(key)}
          </span>
        </div>
      );
    },
  }))];
  return [...columns,
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} actions={options.actions} />,
    },
  ]
};
