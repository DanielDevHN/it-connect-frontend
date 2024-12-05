import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

export const generateColumns = <T,>({
  keys,
  options,
}: {
  keys: { key: string; title: string; render?: (row: T) => React.ReactNode }[];
  options: {
    id: { key: string; title: string };
    actions: Record<string, (id: number) => void>;
  };
}): ColumnDef<T>[] => {
  const columns = [
    {
      header: 'Assets',
      // @ts-expect-error aaa
      cell: ({ row }) => {
        return Array.isArray(row.original['assets']) && row.original['assets'].length > 0 ?
          <button
            onClick={row.getToggleExpandedHandler()}
            style={{ cursor: 'pointer' }}
          >
            {row.getIsExpanded() ? <IconChevronDown/> : <IconChevronRight/>}
          </button>
         : '';
      },
    },
    {
      accessorKey: options.id.key,
      header: ({ column }: { column: Column<T> }) => (
        <DataTableColumnHeader column={column} title={options.id.title} />
      ),
      cell: ({ row }: { row: Row<T> }) => (
        <div className="w-[80px]">{row.getValue(options.id.key)}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...keys.map(({ key, title, render }) => ({
      accessorKey: key,
      header: ({ column }: { column: Column<T> }) => (
        <DataTableColumnHeader column={column} title={title} />
      ),
      cell: ({ row }: { row: Row<T> }) =>
        render ? render(row.original) : <div>{row.getValue(key)}</div>,
    })),
  ];
  return [
    ...columns,
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions row={row} actions={options.actions} />
      ),
    },
  ];
};