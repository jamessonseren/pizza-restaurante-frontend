import { useContext, FormEvent, useState } from 'react'
import Head from 'next/head'
import styles from '../../styles/Home.module.scss'
import Image from 'next/image'
import {Input} from '../components/ui/input'
import { Button } from '../components/ui/button'
import { toast } from 'react-toastify'
import { canSSRGuest } from '../useful/canSSRGuest'

import { AuthContext  } from '../contexts/authContext'


import Link from 'next/link'


import logoImg from '../../public/logo.svg'


export default function Home() {
const { signIn } = useContext(AuthContext)

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const [loading, setLoading] = useState(false)

async function HandleLogin(event: FormEvent){
  event.preventDefault()

  if(email === '' || password ===''){
    toast.warn('Did your forget something?')
    return
  }
setLoading(true)

  let data = {
    email,
    password
  }
  await signIn(data)

  setLoading(false)
}

  return (
    <>
      <Head>
        <title>Pizzaria</title>
      </Head>
  
        <div className={styles.containerCenter}>
          <Image className={styles.logo} src={logoImg} alt="Logo pizzaria"/>

          <div className={styles.login}>
            <h1>Login</h1>
            <form onSubmit={HandleLogin}>
              <Input 
              placeholder='Type your email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
               placeholder='Type your password'
               type='password'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               />

                <Button 
                  type='submit'
                  loading={loading}
                >
                  Access
                  </Button>

            </form>
            <Link className={styles.text} href="/signup">
              Don't have an account yet? Signup here!
            </Link>
            <Link className={styles.text} href="/password-request">
              Forgot your password? Click here to recover!
            </Link>

          </div>
        </div>
      
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {

  return{
    props:{}
  }
})