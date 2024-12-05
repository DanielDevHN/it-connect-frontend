import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PageLayout } from '../pagelayout'
import { useNavigate, useParams } from 'react-router-dom'
import { incidentService } from './incident.service'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { MultiSelect } from '@/components/custom/multiselect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category } from '@/schemas/categoriesschema'
import { categoriesService } from '../categories/categories.service'
import { usersService } from '../users/users.service'
import { User } from '@/schemas/usersschema'
import { Asset } from '@/schemas/assetsschema'
import { ComboBoxField } from '@/components/custom/comboBoxField'
import { assetService } from '../assets/assets.service'
import { CreateIncident, createIncidentSchema, Incident, IncidentPriority, IncidentStatus } from '@/schemas/incidentschema'
import { DatePickerField } from '@/components/custom/datepicker'

export default function IncidentForm() {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [assets, setAssets] = useState<Asset[]>([])

    const { toast } = useToast()
    const navigate = useNavigate()

    const form = useForm<CreateIncident>({
        resolver: zodResolver(createIncidentSchema),
        defaultValues: {
        title: '',
        description: '',
        status: undefined,
        priority: IncidentPriority.Enum.LOW,
        categories: [],
        reporterId: 0,
        assetId: 0,
        assigneeId: 0,
        createdAt: new Date().toISOString(),
        resolvedAt: undefined,
        },
    })

    const status = form.watch('status');

    async function onSubmit(data: CreateIncident) {
        setIsLoading(true)

        const res = id ? await incidentService.putIncident(parseInt(id), data) : await incidentService.postIncident(data)
        if (!res || res.status === 500) navigate('/500')
        if (res.status === 200 || res.status === 201) navigate(-1)
        else toast({
        title: "Something went wrong.",
        description: "Couldn't create the incident.",
        })

        setIsLoading(false)
    }

    const getAndSetCategories = async () => {
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
    };
    
    const getAndSetUsers = async () => {
        if (usersService.getEntities) {
            const res = await usersService.getEntities();
            if (res.status === 200) setUsers(res.data);
            else
                toast({
                title: 'Something went wrong.',
                description: `Couldn't get the Users.`,
                });
            } else {
            toast({
                title: 'Error',
                description: 'getEntities method is not defined in the service.',
            });
        }
    };

    const getAndSetAssets = async () => {
        const res = await assetService.getEntities();
        if (res.status === 200) setAssets(res.data);
        else
            toast({
            title: 'Something went wrong.',
            description: `Couldn't get the Assets.`,
            });
    }


    const getAndSetIncident = async (id: number) => {
        const res = await incidentService.getEntity(id);
        console.log(res);

        const data = res.data as Incident;
    
        if (res.status === 200) {
            // Set form values with the fetched user data
            form.setValue('title', data.title);
            form.setValue('description', data.description);
            form.setValue('status', data.status);
            form.setValue('priority', data.priority);
            form.setValue('reporterId', data.reporter.id);
            // @ts-expect-error aaa
            form.setValue('categories', data.categories ? data.categories.map(category => category.id as number) : []);
            form.setValue('assetId', data.asset?.id);
            form.setValue('assigneeId', data.assignee?.id);
            form.setValue('resolvedAt', data.resolvedAt ? new Date(data.resolvedAt) : undefined);
            // You can set other fields as needed
        }
        if (res.status === 404) navigate('/404');
        else toast({
            title: "Something went wrong.",
            description: "Couldn't get the incident."
        });
        return res;
    }

    const fetchResources = async () => {
        setLoading(true)

        await getAndSetCategories();
        await getAndSetUsers();
        await getAndSetAssets();

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            getAndSetIncident(parseInt(id));
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
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Incident Title" {...field} />
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
                            <Input placeholder="Incident Description" {...field} />
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
                                    onValueChange={(value) => {
                                        console.log(value);                                        
                                        field.onChange(value)
                                    }} // Update the form state
                                >
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status">
                                        {field.value || 'Select status'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {IncidentStatus.options.map((status) => (
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
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select 
                                value={field.value} // Bind value to the form's state
                                onValueChange={(value) => field.onChange(value)} // Update the form state
                            >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority">
                                    {field.value || 'Select priority'}
                                    </SelectValue>
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {IncidentPriority.options.map((priority) => (
                                    <SelectItem key={priority} value={priority}>
                                    {priority}
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
                                    options={categories.map(cat=>{return {label:cat.name, value: cat.id}})}
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
                        formKey="reporterId"
                        title='reporter'
                    />

                    <ComboBoxField
                        form={form}
                        items={users.map(usr=>{return {id: usr.id, name:usr.name}})}
                        formKey="assigneeId"
                        title='assignee'
                    />

                    <ComboBoxField
                        form={form}
                        items={assets.map(usr=>{return {id: usr.id, name:usr.name}})}
                        formKey="assetId"
                        title='asset'
                    />

                    {id &&
                        <DatePickerField
                            form={form}
                            disabled={status !== IncidentStatus.Enum.RESOLVED}
                            formKey="resolvedAt"
                            title="Resolved at"
                            tillToday={true}
                        />
                    }

                    <Button 
                        type="submit" 
                        className="w-full lg:col-span-2" 
                        disabled={isLoading}
                        loading={loading}
                    >
                    {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
                </Form>
            </div>
        </PageLayout>
    )
}