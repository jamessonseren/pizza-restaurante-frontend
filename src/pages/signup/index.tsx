import {FormEvent, useState, useContext} from 'react'

import Head from 'next/head'
import styles from '../../../styles/Home.module.scss'
import Image from 'next/image'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'


import logoImg from '../../../public/logo.svg'

import { AuthContext } from '@/src/contexts/authContext'
import { toast } from 'react-toastify'

export default function Signup() {
const {signUp} = useContext(AuthContext)

const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')

const [loading, setLoading] = useState(false)

async function handleSignUp(e: FormEvent){
  e.preventDefault()

  if(name === '' || email === '' || password === ''){
    toast.warn("Please, complete all fields")
    return
  }else if(password !== confirmPassword){
    toast.warn('Password does not match!')
    setPassword('')
    setConfirmPassword('')
    return
  }

  setLoading(true)

  let data = {
    name,
    email,
    password
  }

  await signUp(data)

  setLoading(false)

}


  return (
    <>
      <Head>
        <title>Sign up here</title>
      </Head>
  
        <div className={styles.containerCenter}>
        <a href="/"><Image className={styles.logo} src={logoImg} alt="Logo pizzaria"/></a>
          

          <div className={styles.login}>
          <h1>Sign up here</h1>
            <form onSubmit={handleSignUp}>
            <Input 
              placeholder='Type your name'
              type='text'
              value={name}
              onChange={(e)=>setName(e.target.value)}
              />
              <Input 
              placeholder='Type your email'
              type='text'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              />
              <Input 
               placeholder='Type your password'
               type='password'
               value={password}
               onChange={(e)=>setPassword(e.target.value)}
               />
               <Input 
               placeholder='Retype your password'
               type='password'
               value={confirmPassword}
               onChange={(e)=>setConfirmPassword(e.target.value)}
               />

                <Button 
                  type='submit'
                  loading={loading}
                >
                  Request new password
                  </Button>

            </form>
            <Link className={styles.text} href="/">
              Already have an account? Signin here!

            </Link>

          </div>
        </div>
      
    </>
  )
}
