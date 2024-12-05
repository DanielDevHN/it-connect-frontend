import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuRadioGroup,
  // DropdownMenuRadioItem,
  DropdownMenuSeparator,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


// import { labels } from '../data/data'
import { useNavigate } from 'react-router-dom'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions: Record<string, (id: number) => void>
}


export function DataTableRowActions<TData>({
  row,
  actions
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
      <DropdownMenuItem className='cursor-pointer' onClick={() => 
          navigate(`${location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : 
            // @ts-expect-error aaa 
            location.pathname}/comments/${row.original.id as number}?userId=${localStorage.getItem('userId')}`)}
            >Comments</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={() => 
          navigate(`${location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : 
            // @ts-expect-error aaa 
            location.pathname}/form/${row.original.id as number}`)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={() => 
          navigate(`${location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : 
            // @ts-expect-error aaa 
            location.pathname}/${row.original.id as number}`)}>Details</DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={() => 
            // @ts-expect-error aaa 
          actions.onDelete && actions.onDelete(row.original.id as number)}
        >Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
