import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PageLayout } from '../pagelayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { MultiSelect } from '@/components/custom/multiselect'
import { Category } from '@/schemas/categoriesschema'
import { categoriesService } from '../categories/categories.service'
import { usersService } from '../users/users.service'
import { User } from '@/schemas/usersschema'
import { ComboBoxField } from '@/components/custom/comboBoxField'
import { CreateRequest, createRequestSchema, RequestSchema, RequestStatus } from '@/schemas/requestsschema'
import { requestService } from './requests.service'
import { DatePickerField } from '@/components/custom/datepicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function RequestForm() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])

  const { toast } = useToast()
  const navigate = useNavigate()


  const form = useForm<CreateRequest>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      status: undefined,
      categories: [],
      requestorId: 0,
      assigneeId: 0,
      plannedForDate: undefined,
      resolvedAt: undefined,
    },
  })

  const status = form.watch('status');


  async function onSubmit(data: CreateRequest) {
    setIsLoading(true)

    const res = id ? await requestService.putRequest(parseInt(id), data) : await requestService.postRequest(data)
    if (!res || res.status === 500) navigate('/500')
    if (res.status === 200 || res.status === 201) navigate(-1)
    else toast({
      title: "Something went wrong.",
      description: "Couldn't create the incident.",
    })

    setIsLoading(false)
  }

    const getAndSetCategories = async () => {
      const res = await categoriesService.getEntities();
      if (res.status === 200) setCategories(res.data);
      else
          toast({
          title: 'Something went wrong.',
          description: `Couldn't get the Categories.`,
          });
    };
    
    const getAndSetUsers = async () => {  
      const res = await usersService.getEntities();
        
      if (res.status === 200) setUsers(res.data);
      else toast({
        title: 'Something went wrong.',
        description: `Couldn't get the Users.`,
      })
    };

  const getAndSetRequest = async (id:number) => {
    setLoading(true);
  
    const res = await requestService.getEntity(id);
    console.log(res);

    const data = res.data as RequestSchema;
    
    if (res.status === 200) {
        // Set form values with the fetched user data
        form.setValue('title', data.title);
        form.setValue('description', data.description);
        form.setValue('status', data.status);
        // @ts-expect-error aaa
        form.setValue('categories', data.categories ? data.categories.map(category => category.id as number) : []);
        form.setValue('requestorId', data.requestor.id);
        form.setValue('assigneeId', data.assignee?.id);
        form.setValue('plannedForDate', new Date(data.plannedForDate));
        form.setValue('resolvedAt', data.resolvedAt ? new Date(data.resolvedAt) : undefined);
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

  
  const fetchResources = async () => {
    setLoading(true)
    
    await getAndSetCategories();
    await getAndSetUsers();
    
    setLoading(false)
  }
  
  useEffect(() => {
    if (id) {
      getAndSetRequest(parseInt(id));
    }
  }, [id])

  useEffect(() => {
    if (status === RequestStatus.Enum.COMPLETED) {
      form.setValue('resolvedAt', new Date());
    } else {
      form.setValue('resolvedAt', undefined);
    }
  }, [status])

  useEffect(() => {
    fetchResources();
  }, [])
  console.log(form.getValues('status') === RequestStatus.Enum.COMPLETED);
  return (
    <PageLayout>
      <div className="mb-4">
        <Button variant="link" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Change cell phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Reasons why..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {id && <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                        value={field.value} // Bind value to the form's state
                        onValueChange={(value) => field.onChange(value)} // Update the form state
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status">
                            {field.value || 'Select status'}
                            </SelectValue>
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RequestStatus.options.map((status) => (
                              <SelectItem key={status} value={status}>
                              {status}
                              </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            }

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={categories && categories.map(cat=>{return {label:cat.name, value: cat.id}})}
                      selected={field.value && field.value.map(String)}
                      onChange={(value) => field.onChange(value.map(Number))}
                      placeholder="Select categories"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ComboBoxField
              form={form}
              items={users.map(usr=>{return {id: usr.id, name:usr.name}})}
              formKey="requestorId"
              title='requestor'
            />

            <ComboBoxField
              form={form}
              items={users.map(usr=>{return {id: usr.id, name:usr.name}})}
              formKey="assigneeId"
              title='asignee'
            />

            <DatePickerField
              form={form}
              formKey="plannedForDate"
              title="Planned for date"
              tillToday={false}
            />

            {id &&
              <DatePickerField
                disabled={status !== RequestStatus.Enum.COMPLETED}
                form={form}
                formKey="resolvedAt"
                title="Resolved at"
                tillToday={false}
              />
            }

            <Button type="submit" className="w-full lg:col-span-2" disabled={isLoading} loading={loading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </PageLayout>
  )
}