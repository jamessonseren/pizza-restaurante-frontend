import Head from "next/head"
import styles from './styles.module.scss'
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { useState, FormEvent } from "react"
import { toast } from "react-toastify"
import { api } from "@/src/services/apiClient"
import Router from 'next/router'
import Image from "next/image"

import logoImg from '../../../public/logo.svg'

interface UserResponse {
    id: string;
    name: string;
    email: string;
}

export default function PasswordRequest() {
    const [email, setEmail] = useState<string>('')
    const [user, setUser] = useState<UserResponse | null>(null)
    const [userExists, setUserExists] = useState(false)
    const [submit, setSubmit] = useState(false)



    async function handleSendEmail(e: FormEvent) {
        e.preventDefault()
        setSubmit(true)

        if (email === '') {
            toast.warn("Please, inform your email!")
            return
        }
        try {
            const response = await api.post<UserResponse>('/new-password', {
                email
            })
            console.log('response.data: ', response.data)
            console.log('response.data typeof: ', typeof response.data)

                if (typeof response.data === 'object') {
                    setUser(response.data)
                    setUserExists(true);
                    setTimeout(() => {
                        Router.push('/')
                    }, 3000);
                } else if(typeof response.data === 'string'){
                    setUserExists(false);    
                }
                
            
    } catch (err) {
        console.log(err)
        setUserExists(false)
    }
    setEmail('')
    

}

return (
    <>
        <Head>
            <title>Recover Password</title>
        </Head>
        <div className={styles.container}>
            <div className={styles.box}>
            <a href="/"><Image className={styles.logo} src={logoImg} alt="Logo pizzaria"/></a>
                <h1>Please, inform your email to recover your password.</h1>
                <form onSubmit={handleSendEmail} className={styles.form}>
                    <Input
                        placeholder="Type your email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%' }}
                    />

                    <Button
                        type='submit'
                        style={{ width: '100%' }}
                    >
                        Request new password
                    </Button>

                </form>
                {submit && !userExists && (
            <h4 className={styles.submitMessage} style={{color: 'red'}}>Email not found. Please check your email and try again.</h4>
            )}
            {userExists && (
                <h4 className={styles.submitMessage} style={{color: '#fff'}}>Very good, <strong>{user?.name}</strong>, please check your email inbox</h4>
)}
        
            </div>

        </div>
    </>
)
}