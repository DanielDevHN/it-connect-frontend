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
import { Asset, AssetStatus, AssetType, CreateAsset, createAssetSchema } from '@/schemas/assetsschema'
import { assetService } from './assets.service'
import { DatePickerField } from '@/components/custom/datepicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AssetForm() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])

  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<CreateAsset>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      name: '',
      description: '',
      categories: [],
      ownerId: 0,
      status: AssetStatus.Enum.ACTIVE,
      type: AssetType.Enum.HARDWARE,
      purchasedAt: undefined,
      warrantyExpiresAt: undefined,
      createdAt: new Date().toISOString(),
    },
  })

  async function onSubmit(data: CreateAsset) {
    setIsLoading(true)

    const res = id ? await assetService.putAsset(parseInt(id), data) : await assetService.postAsset(data)
    if (!res || res.status === 500) navigate('/500')
    if (res.status === 200 || res.status === 201) navigate(-1)
    else toast({
      title: "Something went wrong.",
      description: "Couldn't create the asset.",
    })

    setIsLoading(false)
  }

  const getAndSetCategories = async () => {
      setLoading(true);

      if (categoriesService.getEntities) {
          const res = await categoriesService.getEntities();
          if (res.status === 200) setCategories(res.data);
          else
              toast({
              title: 'Something went wrong.',
              description: `Couldn't get the Categories.`,
              });
          } else {
          toast({
              title: 'Error',
              description: 'getEntities method is not defined in the service.',
          });
      }

      setLoading(false);
  };
  
  const getAndSetUsers = async () => {  
    setLoading(true);
      const res = await usersService.getEntities();
      
      if (res.status === 200) setUsers(res.data);
      else toast({
        title: 'Something went wrong.',
        description: `Couldn't get the Users.`,
      })
      setLoading(false);
  };

  const getAndSetAsset = async (id:number) => {  
    const res = await assetService.getEntity(id);
    console.log(res);

    const data = res.data as Asset;
    
    if (res.status === 200) {
        // Set form values with the fetched user data
        form.setValue('name', data.name);
        form.setValue('description', data.description);
        form.setValue('categories', data.categories.map(category => category.id));
        form.setValue('ownerId', data.owner?.id);
        form.setValue('status', data.status);
        form.setValue('type', data.type);
        form.setValue('purchasedAt', new Date(data.purchasedAt));
        form.setValue('warrantyExpiresAt', data.warrantyExpiresAt ? new Date(data.warrantyExpiresAt) : undefined);        
        // You can set other fields as needed
    }
    if (res.status === 404) navigate('/404');
    else toast({
      title: "Something went wrong.",
      description: "Couldn't get the user."
    });
    
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
      getAndSetAsset(parseInt(id));
    }
  }, [id])

  useEffect(() => {
    fetchResources();
  }, [])

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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Asset name" {...field} />
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
                    <Input placeholder="Asset description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
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
                      {AssetStatus.options.map((status) => (
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

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          {AssetType.options.map((type) => (
                              <SelectItem key={type} value={type}>
                                  {type}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              formKey="ownerId"
              title='owner'
            />

            <DatePickerField
              form={form}
              formKey="purchasedAt"
              title="purchased at"
              tillToday={true}
            />

            <DatePickerField
              form={form}
              formKey="warrantyExpiresAt"
              title="Warranty expires at"
              tillToday={false}
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