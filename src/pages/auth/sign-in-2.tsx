import { Card } from '@/components/ui/card'
import { UserAuthForm } from './components/user-auth-form'
import UserForm from '../users/form'
import { Button } from '@/components/custom/button'
import { useState } from 'react'

export default function SignIn2() {
  const [showSignUp, setShowSignUp] = useState(false)

  const header = () => (
    <div className='flex flex-col space-y-2 text-left'>
    <h1 className='text-2xl font-semibold tracking-tight'>{showSignUp ? 'Sign Up' : 'Login'}</h1>
    <p className='text-sm text-muted-foreground'>
      Enter your email and password below <br />
      to 
      {showSignUp ? ' create your account' : ' log into your account'}
    </p>
  </div>
  )

  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            <h1 className='text-xl font-medium'>IT Manager System</h1>
          </div>
          <Card className='p-6'>
            {
              showSignUp ? <UserForm 
                signUp={true} 
                setShowSignUp={()=>setShowSignUp(false)}
                // @ts-expect-error aaa
                header={header} 
              /> : (
                <>
                  {
                    header()
                  }
                  <UserAuthForm />
                  <Button
                    className='w-full mt-4'
                    variant={'secondary'} 
                    onClick={() => setShowSignUp(true)}
                  >
                      Sign Up
                  </Button>
                </>
              )
            }
          </Card>
        </div>
      </div>
    </>
  )
}