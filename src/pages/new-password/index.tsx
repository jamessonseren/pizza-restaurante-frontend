import Head from "next/head";
import styles from './styles.module.scss'
import { Input } from "@/src/components/ui/input";
import {useState, FormEvent, useEffect} from 'react'
import { Button } from "@/src/components/ui/button"
import { toast } from "react-toastify";
import { api } from "@/src/services/apiClient";
import { useRouter } from "next/router";
import Router from "next/router";



export default function NewPassword(){

    const router = useRouter()
    const {user_id} = router.query

    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    console.log(user_id)

    useEffect(() => {
        if (user_id === undefined) {
          router.push('/'); 
          return
        }
      }, [user_id]);

    
    async function handleNewPassword(e: FormEvent){
        e.preventDefault()
        if(newPassword !== confirmNewPassword){
            toast.warn('Password does not match')
            setNewPassword('')
            setConfirmNewPassword('')
            return
        }

        if(newPassword === '' || confirmNewPassword === ''){
            toast.warn("Please, complete all fields")
            return
    
        }

        try {
            const response = await api.put(`/new-password/?user_id=${user_id}`, {
              password: confirmNewPassword
              
            });
            toast.success('Password changed successfully')
            setTimeout(() =>{
                Router.push('/')
            }, 3000)
            // console.log('response.data: ', response.data)
          } catch (err) {
            console.log(err);
          }
        
    }

    return(
        <>
            <Head>
                <title>New Password</title>
            </Head>
            
            <div className={styles.container}>
                <h1>New password</h1>
                <form onSubmit={handleNewPassword} className={styles.form}>
                <Input
                        placeholder="Type your new password"
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <Input
                        placeholder="Confirm your new password"
                        type="text"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <Button
                        type='submit'
                        style={{ width: '100%' }}
                    >
                        Change password
                    </Button>
                </form>
            </div>
        </>
    )
}