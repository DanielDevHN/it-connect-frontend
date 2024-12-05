import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in-2')).default,
    }),
  },
  // {
  //   path: '/sign-in-2',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/sign-in-2')).default,
  //   }),
  // },
  // {
  //   path: '/sign-up',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/sign-up')).default,
  //   }),
  // },
  // {
  //   path: '/forgot-password',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/forgot-password')).default,
  //   }),
  // },
  // {
  //   path: '/otp',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/otp')).default,
  //   }),
  // },

  // Main routes
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError/>,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      // {
      //   path: 'tasks',
      //   lazy: async () => ({
      //     Component: (await import('@/pages/tasks')).default,
      //   }),
      // },
      // {
      //   path: 'chats',
      //   lazy: async () => ({
      //     Component: (await import('@/pages/chats')).default,
      //   }),
      // },
      // {
      //   path: 'apps',
      //   lazy: async () => ({
      //     Component: (await import('@/pages/apps')).default,
      //   }),
      // },
      {
        path: 'users',
        lazy: async () => ({
          Component: (await import('@/pages/users')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'users/:id',
        lazy: async () => ({
          Component: (await import('@/pages/users/details')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'users/form',
        lazy: async () => ({
          Component: (await import('@/pages/users/form')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'users/form/:id',
        lazy: async () => ({
          Component: (await import('@/pages/users/form')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'requestss',
        lazy: async () => ({
          Component: (await import('@/pages/requestss')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'requestss/:id',
        lazy: async () => ({
          Component: (await import('@/pages/requestss/details.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'requestss/form',
        lazy: async () => ({
          Component: (await import('@/pages/requestss/form.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'requestss/form/:id',
        lazy: async () => ({
          Component: (await import('@/pages/requestss/form.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'requestss/comments/:id',
        lazy: async () => ({
          Component: (await import('@/pages/comments')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'assets',
        lazy: async () => ({
          Component: (await import('@/pages/assets')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'assets/:id',
        lazy: async () => ({
          Component: (await import('@/pages/assets/details.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'assets/form',
        lazy: async () => ({
          Component: (await import('@/pages/assets/form.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'assets/form/:id',
        lazy: async () => ({
          Component: (await import('@/pages/assets/form.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'categories',
        lazy: async () => ({
          Component: (await import('@/pages/categories')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'categories/:id',
        lazy: async () => ({
          Component: (await import('@/pages/categories/details.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'categories/form',
        lazy: async () => ({
          Component: (await import('@/pages/categories/form.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'categories/form/:id',
        lazy: async () => ({
          Component: (await import('@/pages/categories/form')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'incidents',
        lazy: async () => ({
          Component: (await import('@/pages/incidents')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'incidents/:id',
        lazy: async () => ({
          Component: (await import('@/pages/incidents/details.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'incidents/form',
        lazy: async () => ({
          Component: (await import('@/pages/incidents/form.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'incidents/form/:id',
        lazy: async () => ({
          Component: (await import('@/pages/incidents/form.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'knowledgearticles',
        lazy: async () => ({
          Component: (await import('@/pages/knowledgearticles')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'knowledgearticles/:id',
        lazy: async () => ({
          Component: (await import('@/pages/knowledgearticles/details.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'knowledgearticles/form',
        lazy: async () => ({
          Component: (await import('@/pages/knowledgearticles/form.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'knowledgearticles/form/:id',
        lazy: async () => ({
          Component: (await import('@/pages/knowledgearticles/form.tsx')).default,
        }),
        errorElement: <GeneralError/>,
      },
      {
        path: 'incidents/comments/:id',
        lazy: async () => ({
          Component: (await import('@/pages/comments')).default,
        }),
        errorElement: <GeneralError/>,
      },
      // {
      //   path: 'analysis',
      //   lazy: async () => ({
      //     Component: (await import('@/components/coming-soon')).default,
      //   }),
      // },
      // {
      //   path: 'extra-components',
      //   lazy: async () => ({
      //     Component: (await import('@/pages/extra-components')).default,
      //   }),
      // },
      // {
      //   path: 'settings',
      //   lazy: async () => ({
      //     Component: (await import('./pages/settings')).default,
      //   }),
      //   errorElement: <GeneralError/>,
      //   children: [
      //     {
      //       index: true,
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/profile')).default,
      //       }),
      //     },
      //     {
      //       path: 'account',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/account')).default,
      //       }),
      //     },
      //     {
      //       path: 'appearance',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/appearance')).default,
      //       }),
      //     },
      //     {
      //       path: 'notifications',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/notifications'))
      //           .default,
      //       }),
      //     },
      //     {
      //       path: 'display',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/display')).default,
      //       }),
      //     },
      //     {
      //       path: 'error-example',
      //       lazy: async () => ({
      //         Component: (await import('./pages/settings/error-example'))
      //           .default,
      //       }),
      //       errorElement: <GeneralError className='h-[50svh]' minimal />,
      //     },
      //   ],
      // },
    ],
  },

  // Error routes
  { path: '/500', Component: null },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
