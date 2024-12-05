import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PageLayout } from '../pagelayout'
import { useNavigate, useParams } from 'react-router-dom'
import { knowledgearticleService } from './knowledgearticle.service'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { MultiSelect } from '@/components/custom/multiselect'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category } from '@/schemas/categoriesschema'
import { categoriesService } from '../categories/categories.service'
import { usersService } from '../users/users.service'
import { User } from '@/schemas/usersschema'
import { Asset } from '@/schemas/assetsschema'
import { ComboBoxField } from '@/components/custom/comboBoxField'
import { assetService } from '../assets/assets.service'
import {createKnowledgeArticleSchema, CreateKnowledgeArticle, KnowledgeArticle} from '@/schemas/knowledgearticlesschema';
import {FileUpload} from '../../components/custom/fileupload'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";


export default function KnowledgeArticleForm() {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [assets, setAssets] = useState<Asset[]>([])
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState<string>('No file chosen');
    const [showFileRequiredMessage, setShowFileRequiredMessage] = useState(false);


    const { toast } = useToast()
    const navigate = useNavigate()

    const form = useForm<CreateKnowledgeArticle>({
        resolver: zodResolver(createKnowledgeArticleSchema),
            defaultValues: {
                title: '',
                docUrl: undefined,
                categories: [],
                assets: [],
                createdById: 0,
                createdAt: new Date().toISOString(),
            }
        }
    )    

    const submitForm = async(docUrl: string, data: CreateKnowledgeArticle) => {
        // Now you can submit the form data
        setIsLoading(true);

        const res = id ? await knowledgearticleService.putKnowledgearticle(parseInt(id), data, docUrl) : await knowledgearticleService.postKnowledgearticle(data, docUrl);
        
        if (!res || res.status === 500) {
            navigate('/500');
        } else if (res.status === 200 || res.status === 201) {
            navigate(-1);
        } else {
            toast({
            title: "Something went wrong.",
            description: "Couldn't create the article.",
            });
        }
    
        setIsLoading(false);
    }

    async function onSubmit(data: CreateKnowledgeArticle) {
        if (!form.getValues('docUrl')) {
            if (!file) {
                setShowFileRequiredMessage(true);
                return;
            }
      
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
        
            uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error("Upload failed", error);
            },
            async () => {
                // Once upload is complete, get the file URL
                const docUrl = await getDownloadURL(uploadTask.snapshot.ref);
                setShowFileRequiredMessage(false);
                await submitForm(docUrl, data);
            }
            );
        } else {
            setShowFileRequiredMessage(false);
            //@ts-expect-error aaa
            await submitForm(form.getValues('docUrl'), data);
        }
    } 

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // Tamaño máximo: 5 MB

    const handleFileChange = (file: File | null) => {
        if (file) {
          if (file.size > MAX_FILE_SIZE) {
            toast({
              title: 'Warning',
              description: 'The file exceeds 5MB.',
            });
            setFile(null);
            setFileName("No file chosen");
            setProgress(0);
            return;
          }
      
          setFile(file);
          setFileName(file.name);
          setProgress(0); // Reset progress bar
          setShowFileRequiredMessage(false); // Hide the message
        } else {
            setFile(null);
            setFileName("No file chosen");
            setProgress(0);
            setShowFileRequiredMessage(true); // Hide the message
        }
    };      

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
        if (res.status === 200) {
            setAssets(res.data)
        }
        else
            toast({
            title: 'Something went wrong.',
            description: `Couldn't get the Assets.`,
            });
    }

    const getAndSetKnowledgeArticle = async (id: number) => {
        const res = await knowledgearticleService.getEntity(id);

        const data = res.data as KnowledgeArticle;
    
        if (res.status === 200) {
            // Set form values with the fetched user data
            form.setValue('title', data.title);
            form.setValue('docUrl', data.docUrl);
            setFileName(data.docUrl);
            //@ts-expect-error aaa
            form.setValue('categories', data.categories ? data.categories.map(category => category.id as number) : []);
            //@ts-expect-error aaa
            form.setValue('assets', data.assets ? data.assets.map(asset => asset.assetId as number) : []);
            form.setValue('createdById', data.createdBy.id);
            form.setValue('lastModifiedById', data.lastModifiedBy ? data.lastModifiedBy.id : undefined);
        }
        if (res.status === 404) navigate('/404');
        else toast({
            title: "Something went wrong.",
            description: "Couldn't get the article."
        });
    
        return res;
    }

    const fetchResources = async () => {
        setLoading(true)

        getAndSetCategories();
        getAndSetUsers();
        getAndSetAssets();

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            form.setValue('createdById', parseInt(id));
            getAndSetKnowledgeArticle(parseInt(id));
        }
    }, [id])

    useEffect(() => {
        fetchResources();
    }, [])

    return (
        <PageLayout>
        <div className="mb-4">
            <Button variant="link" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="mr-2 h-4 w-4"/>
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
                            <Input placeholder="Title" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="docUrl"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Document URL</FormLabel>
                        <FormControl>
                            <FileUpload
                                progress={progress}
                                handleFileChange={handleFileChange}
                                setProgress={setProgress}
                                fileName={fileName}
                            />
                        </FormControl>
                        {
                            showFileRequiredMessage &&
                            <p className="text-[0.8rem] font-medium text-destructive">Please select a file</p>
                        }
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

                <FormField
                    control={form.control}
                    name="assets"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assets</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={assets.map(asss=>{return {label:asss.name, value: asss.id}})}
                                    //@ts-expect-error aaa
                                    selected={field.value && field.value.map(String)}
                                    onChange={(value) => field.onChange(value.map(Number))}
                                    placeholder="Select assests"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <ComboBoxField
                    form={form}
                    items={users.map(usr=>{return {id: usr.id, name:usr.name}})}
                    formKey="createdById"
                    title='created by'
                />

                {id &&
                    <ComboBoxField
                        form={form}
                        items={users.map(usr=>{return {id: usr.id, name:usr.name}})}
                        formKey="lastModifiedById"
                        title='last modified by'
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