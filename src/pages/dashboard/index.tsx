import { Layout } from '@/components/custom/layout'
// import { Button } from '@/components/custom/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
// import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { RecentSales } from './components/recent-sales'
import { Overview } from './components/overview'
import { useTranslations } from 'use-intl'
// import LanguageSwitch from '@/components/language-switch'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { incidentService } from '../incidents/incident.service'
import { Skeleton } from '@/components/ui/skeleton'
import { requestService } from '../requestss/requests.service'
import { assetService } from '../assets/assets.service'
import { knowledgearticleService } from '../knowledgearticles/knowledgearticle.service'

export default function Dashboard() {
  const t = useTranslations('dashboard')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  
  const [incidents, setIncidents] = useState(null)
  
  const [data, setData] = useState<{name: string; total: number}[] | null>(null)
  const [requestsData, setRequestsData] = useState<{name: string; total: number}[] | null>(null)
  const [assetsData, setAssetsData] = useState<{name: string; total: number}[] | null>(null)
  const [articlesData, setArticlesData] = useState<{name: string; total: number}[] | null>(null)
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  
  const [asset, setAsset] =  useState(null);

  const [assigneeIncidents, setAssigneeIncidents] =  useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [requestor, setRequestor] =  useState(null);
  
  const [assigneeRequests, setAssigneeRequests] =  useState(null);
  
  const [requests, setRequests] = useState(null)
  
  const [assets, setAssets] = useState(null)
  
  const [owner, setOwner] =  useState(null);

  const [articles, setArticles] = useState(null)

  const [assetWithMostArticles, setAssetWithMostArticles] =  useState(null);

  const [creator, setCreator] =  useState(null);

  const getAndSetData = async () => {
    try {
      const response = await incidentService.getByPriority();
      setData(response.data);

      const recentIncidentsResponse = await incidentService.getRecents();
      setIncidents(recentIncidentsResponse.data);

      const assetWithMostIncidentsRes = await incidentService.getAssetWithMostIncidents();
      setAsset(assetWithMostIncidentsRes.data);

      const assigneeWithMostResolvedIncidentsRes = await incidentService.getAssigneeWithMostResolvedIncidents();
      setAssigneeIncidents(assigneeWithMostResolvedIncidentsRes.data);

      const requestsByStatus = await requestService.getByStatus();
      setRequestsData(requestsByStatus.data);

      const recentRequestsResponse = await requestService.getRecents();
      setRequests(recentRequestsResponse.data);

      const requestorWithMostRequestsRes = await requestService.getRequestorWithMostRequests();
      setRequestor(requestorWithMostRequestsRes.data);

      const assigneeWithMostResolvedRequestsRes = await requestService.getAssigneeWithMostResolvedRequests();
      setAssigneeRequests(assigneeWithMostResolvedRequestsRes.data);

      const assetsByType = await assetService.getByType();
      setAssetsData(assetsByType.data);

      const recentAssetsResponse = await assetService.getRecents();
      setAssets(recentAssetsResponse.data);

      const userWithMostAssetsRes = await assetService.getUserWithMostAssets();
      setOwner(userWithMostAssetsRes.data);

      const articlesByCategory = await knowledgearticleService.getByCategory();
      setArticlesData(articlesByCategory.data);

      const recentArticlesResponse = await knowledgearticleService.getRecents();
      setArticles(recentArticlesResponse.data);

      const assetWithMostArticlesRes = await knowledgearticleService.getAssetWithMostArticles();
      setAssetWithMostArticles(assetWithMostArticlesRes.data);

      const userWithMostArticlesRes = await knowledgearticleService.getUserWithMostArticles();
      setCreator(userWithMostArticlesRes.data);

      setIsLoading(false);
    } catch(error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch data',
      })
    }
  }

  useEffect(() => {

    getAndSetData();

    if (!token) {
      navigate("/sign-in");
    }
    const _name = localStorage.getItem('name');
    const _email = localStorage.getItem('email');
    setName(_name || '');
    setEmail(_email || '');
  }, [token]);

  // if (!token) {
  //   navigate("/sign-in");
  // }
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
          <h1 className='text-4xl font-bold tracking-tight mt-6'>
            {t('dashboard')}
          </h1>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          {/* <Search /> */}
          <ThemeSwitch />
          {/* <LanguageSwitch /> */}
          <UserNav name={name} email={email} />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='incidents'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='incidents'>{t('incidents')}</TabsTrigger>
              <TabsTrigger value='requests'>{t('requests')}</TabsTrigger>
              <TabsTrigger value='assets'>{t('assets')}</TabsTrigger>
              <TabsTrigger value='articles'>
                {t('articles')}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='incidents' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Asset
                  </CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    //@ts-expect-error aaa
                    asset?.incidents?.length
                  )}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[200px]" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {
                        //@ts-expect-error aaa
                        asset?.name
                      }
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    with most incidents
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Assignee
                  </CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    //@ts-expect-error aaa
                    assigneeIncidents?.resolvedIncidents
                  )}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[200px]" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {
                        //@ts-expect-error aaa
                        assigneeIncidents?.name
                      }
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    with most resolved incidents
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>{t('overview')}</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  {isLoading ? (
                    <Skeleton className="h-[40vh] w-full" />
                  ) : (
                    <Overview data={data} />
                  )}
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Unresolved Incidents</CardTitle>
                  <CardDescription>
                    Ordered by priority
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <RecentSales data={incidents} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='requests' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Requestor
                  </CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    //@ts-expect-error aaa
                    requestor?.requests?.length
                  )}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[200px]" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {
                        //@ts-expect-error aaa
                        requestor?.name
                      }
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    with most requests
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Assignee
                  </CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    //@ts-expect-error aaa
                    assigneeRequests?.resolvedRequests
                  )}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[200px]" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {
                        //@ts-expect-error aaa
                        assigneeRequests?.name
                      }
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    with most resolved requests
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>{t('overview')}</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  {isLoading ? (
                    <Skeleton className="h-[40vh] w-full" />
                  ) : (
                    <Overview data={requestsData} />
                  )}
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Unresolved Requests</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <RecentSales data={requests} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='assets' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    User
                  </CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    //@ts-expect-error aaa
                    owner?.totalAssets
                  )}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[200px]" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {
                        //@ts-expect-error aaa
                        owner?.name
                      }
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    with most assigned assets
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Asset
                  </CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    //@ts-expect-error aaa
                    asset?.incidents?.length
                  )}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[200px]" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {
                        //@ts-expect-error aaa
                        asset?.name
                      }
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    with most incidents
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>{t('overview')}</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  {isLoading ? (
                    <Skeleton className="h-[40vh] w-full" />
                  ) : (
                    <Overview data={assetsData} />
                  )}
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Assets</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <RecentSales data={assets} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='articles' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    User
                  </CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    //@ts-expect-error aaa
                    creator?.totalArticles
                  )}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[200px]" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {
                        //@ts-expect-error aaa
                        creator?.name
                      }
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    with most created articles
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Asset
                  </CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    //@ts-expect-error aaa
                    assetWithMostArticles?.totalArticles
                  )}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[200px]" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {
                        //@ts-expect-error aaa
                        assetWithMostArticles?.name
                      }
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    with most articles
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>{t('overview')}</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  {isLoading ? (
                    <Skeleton className="h-[40vh] w-full" />
                  ) : (
                    <Overview data={articlesData} />
                  )}
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Articles</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <RecentSales data={articles} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const topNav = [
  {
    title: 'dashboard.overview',
    href: 'dashboard/overview',
    isActive: true,
  },
  {
    title: 'dashboard.customers',
    href: 'dashboard/customers',
    isActive: false,
  },
  {
    title: 'dashboard.products',
    href: 'dashboard/products',
    isActive: false,
  },
  {
    title: 'dashboard.settings',
    href: 'dashboard/settings',
    isActive: false,
  },
]
