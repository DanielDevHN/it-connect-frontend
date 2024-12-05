import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuRadioGroup,
  // DropdownMenuRadioItem,
  // DropdownMenuSeparator,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


// import { labels } from '../data/data'
import { userSchema } from '../../../schemas/usersschema'
import { useNavigate } from 'react-router-dom'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions: Record<string, (id: number) => void>
}


export function DataTableRowActions<TData>({
  row,
  actions
}: DataTableRowActionsProps<TData>) {
  const user = userSchema.parse(row.original)
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
        {/* <DropdownMenuItem className='cursor-pointer' onClick={() => actions.openComments && actions.openComments(row.original.id as number)}>Reset Password</DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem className='cursor-pointer' onClick={() => navigate(`${location.pathname}/form/${user.id}`)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={() => navigate(`${location.pathname}/${user.id}`)}>Details</DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={() => actions.onDelete && actions.onDelete(user.id)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
