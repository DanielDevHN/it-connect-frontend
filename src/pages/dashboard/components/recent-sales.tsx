import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IconExternalLink } from '@tabler/icons-react'

export function RecentSales({ data }: { data: any }) {
  return (
    <div className='space-y-8'>
      { data &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map((item:any)=>
          (

            <div className='flex items-center gap-4'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src='/avatars/01.png' alt='Avatar' />
                <AvatarFallback>{item.id}</AvatarFallback>
              </Avatar>
              <div className='flex flex-1 flex-wrap items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium leading-none'>{item.title || item.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {item.reporter ? 'Reporter' : item.requestor ? 'Requestor' : 'Owner'}: {item.reporter?.name || item.requestor?.name || item.owner?.name || item.createdBy?.name}
                  </p>
                </div>
                {
                  item.docUrl ?
                  <a href={item.docUrl} className='flex items-center hover:underline' target="_blank" rel="noopener noreferrer">
                    <IconExternalLink className="mr-2 h-4 w-4" />
                    Open
                  </a> : 
                  <div className='font-medium'>{item.priority || item.status}</div>
                }
              </div>
            </div>
          )
        )
      }
    </div>
  )
}
