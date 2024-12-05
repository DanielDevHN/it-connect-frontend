import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar, FilterProps } from './data-table-toolbar'
import { IconExternalLink } from '@tabler/icons-react'
// import { KnowledgeArticle } from '@/schemas/knowledgearticlesschema'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  viewActions?: Record<string, () => void>
  filter: FilterProps
}

export function DataTable<TData, TValue>({
  columns,
  data,
  viewActions,
  filter
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    // @ts-expect-error aaa
    getSubRows: (row) => Array.isArray(row.articles) ? row.articles : [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getRowCanExpand: (row) => true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} filter={filter} viewActions={viewActions} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && 
                    Array.isArray(row.originalSubRows) &&
                    row.originalSubRows
                        // @ts-expect-error aae
                      .filter((subRow) => subRow && subRow.article) // Ensure subRow and asset are valid
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .map((subRow: any) => (
                        <TableRow key={subRow.article.id}>
                          <TableCell></TableCell>
                          <TableCell>{subRow.article.id}</TableCell>
                          <TableCell>{subRow.article.title}</TableCell>
                          <TableCell>
                            <a href={subRow.article.docUrl} className='flex items-center hover:underline' target="_blank" rel="noopener noreferrer">
                              <IconExternalLink className="mr-2 h-4 w-4" />
                              Open
                            </a>
                          </TableCell>
                          <TableCell>{subRow.article.createdBy.name}</TableCell>
                          <TableCell>{subRow.article.lastModifiedBy ? subRow.article.lastModifiedBy.name : ""}</TableCell>
                        </TableRow>
                      ))
                  }
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
