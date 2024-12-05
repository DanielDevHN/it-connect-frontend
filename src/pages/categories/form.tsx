import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PageLayout } from '../pagelayout'
import { useNavigate, useParams } from 'react-router-dom'
import { categoriesService } from './categories.service'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { createCategorySchema } from '@/schemas/categoriesschema'

type CreateCategory = z.infer<typeof createCategorySchema>
// type Category = z.infer<typeof categorySchema>

export default function CategoryForm() {
  const { id } = useParams<{ id: string }>(); // Extract 'id' from the route parameters

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast()

  const navigate = useNavigate();

  const form = useForm<CreateCategory>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
        name: '',
    }})

  async function onSubmit(data: CreateCategory) {
    setIsLoading(true)
    const res = id ? await categoriesService.putCategory({
        ...data,
        id: parseInt(id)
    }) : await categoriesService.postCategory(data);
    

    if (!res || res.status === 500) navigate('/500');
    if (res.status === 200 || res.status === 201) navigate(-1)
    else toast({
        title: "Something went wrong.",
        description: "Couldn't set the user."
      });
    setIsLoading(false)
  }

  const getAndSetUser = async (id:number) => {
    setLoading(true);
  
    const res = await categoriesService.getEntity(id);
    console.log(res);
    
    if (res.status === 200) {
        form.setValue('name', res.data.name);
        // You can set other fields as needed
    }
    if (res.status === 404) navigate('/404');
    else toast({
      title: "Something went wrong.",
      description: "Couldn't get the user."
    });
    
    setLoading(false);
    return res
  }


  useEffect(() => {
    if (id) {
      getAndSetUser(parseInt(id));
    }
  }, [id]);

  return (
    <PageLayout>
        <div className="mb-4">
            <Button variant="link" onClick={() => navigate(-1)}>
                <ArrowLeftIcon className='mr-2 h-4 w-4' />
                Go Back
            </Button>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Others" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full lg:col-span-2" disabled={isLoading} loading={loading}>
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </Form>
        </div>
    </PageLayout>
  )
}