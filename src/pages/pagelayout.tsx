import { ReactNode, useEffect, useState } from "react";
import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { useNavigate } from "react-router-dom";

export function PageLayout({children}:{children:ReactNode}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    }
    const _name = localStorage.getItem('name');
    const _email = localStorage.getItem('email');
    setName(_name || '');
    setEmail(_email || '');
  }, [token]);

  return(
      <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        {/* <Search /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav name={name} email={email} />
        </div>
      </Layout.Header>

      <Layout.Body>{children}</Layout.Body>
      </Layout>
  )
}