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
import { createUserSchema, updateUserSchema } from '../../schemas/usersschema'
import { PageLayout } from '../pagelayout'
import { useNavigate, useParams } from 'react-router-dom'
import { usersService } from './users.service'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

type CreateUser = z.infer<typeof createUserSchema>
type UpdateUser = z.infer<typeof createUserSchema>

interface UserFormProps {
  signUp?: boolean
  setShowSignUp?: (value: boolean) => void
  header?: JSX.Element
}

export default function UserForm({...props}: UserFormProps) {
  const { id } = useParams<{ id: string }>(); // Extract 'id' from the route parameters

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast()

  const navigate = useNavigate();

  const schema = id ? updateUserSchema : createUserSchema;

  const form = useForm<CreateUser | UpdateUser>({
    resolver: zodResolver(schema),
    defaultValues: {
        createdAt: new Date().toISOString(),
        email: '',
        name: '',
        phone: undefined,
        password: '',
        confirmPassword: ''
    }})

  async function onSubmit(data: CreateUser | UpdateUser) {
    setIsLoading(true)
    const res = id ? await usersService.putUser({
        ...data, updatedAt: new Date().toISOString(),
        id: parseInt(id)
    }) : await usersService.postUser(data);
    // console.log(res, 'respostuser');
    

    if (!res || res.status === 500) navigate('/500');
    if (res.status === 200 || res.status === 201) {
        if (props.signUp) {
            // @ts-expect-error aaa
            props.setShowSignUp(false);
            toast({
                title: "Signed up successfully.",
                description: "Please login to continue.",
            });
            return;
        }
        navigate(-1)
    }
    if (res.status === 409) toast({
        title: "Change the email.",
        description: "There is a user with the same email."
      });
    else toast({
        title: "Something went wrong.",
        description: "Couldn't set the user."
      });
    setIsLoading(false)
  }

  const getAndSetUser = async (id:number) => {
    setLoading(true);
  
    const res = await usersService.getEntity(id);
    // console.log(res);
    
    if (res.status === 200) {
        // Set form values with the fetched user data
        form.setValue('email', res.data.email);
        form.setValue('name', res.data.name);
        form.setValue('phone', res.data.phone || undefined);
        form.setValue('createdAt', res.data.createdAt);
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

  return props.signUp ?
    (
    <div className="mx-auto max-w-7xl ">
        {
            props.signUp &&
                // @ts-expect-error aaa
                <Button variant="link" onClick={() => props.setShowSignUp(false)}>
                    <ArrowLeftIcon className='mr-2 h-4 w-4' />
                    Go Back
                </Button>
        }
        {
            props.header &&
                // @ts-expect-error aaa
                props.header()
        }
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                        <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {!id &&
                    <>
                    
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input type='password' placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
    
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            )}
                        />
                    </>
                }

                <Button type="submit" className="w-full lg:col-span-2" disabled={isLoading} loading={loading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
        </Form>
    </div>   
    )
  : (
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
                            <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {!id &&
                        <>
                        
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                    <Input type='password' placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
        
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                                )}
                            />
                        </>
                    }


                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                            <Input 
                                type="tel" 
                                placeholder="+1234567890" 
                                {...field}
                                value={field.value ?? ''} 
                            />
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