import { createContext, ReactNode, useEffect, useState } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { api } from '../services/apiClient';
import {toast} from 'react-toastify'



type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
    passwordRequest: (credentials: PasswordRequestProps) => void;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string
}

type PasswordRequestProps = {
    email: string
}


type AuthProviderProps = {
    children: ReactNode;
  
}

export const AuthContext = createContext({} as AuthContextData) 

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    }catch{
        console.log('logout error')
    }
}


export function AuthProvider({ children }: AuthProviderProps){

    const [user, setUser] = useState<UserProps>({id: '',name:'', email:''})
    const isAuthenticated = !!user

    useEffect(() => {
        
        //Try do get info from the cookie
        const {'@nextauth.token': token} = parseCookies()

        if(token){
            api.get('/me').then(response => {
                const { id, name, email } = response.data

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() => {
                //if something wrong, sign out
                signOut()
            })
        }
    }, [])
    
    async function signIn({email, password}:SignInProps){
       try{
        const response = await api.post('/session', {
            email,
            password
        })
        // console.log(response.data)
        const { id, name, token } = response.data

        setCookie(undefined, '@nextauth.token', token, {
            maxAGe: 60 * 60 * 24 * 30, // expires in 1 month
            path: "/" // which paths will have access to the cookie
        })

        setUser({
            id,
            name,
            email
        })

        //Send token to others requests
        api.defaults.headers['Authorization'] = `Bearer ${token}`

        //show notification
        toast.success('Login successfully')

        //send user to /dashboard
        Router.push('/dashboard')

       }catch(err){
        toast.error('Login error')
        console.log("Login error ", err)
       }
    }

    async function signUp({name, email, password}:SignUpProps){
        try{

            const response = await api.post('/user', {
                name,
                email,
                password
            })
            toast.success("Sign Up successfully")
            Router.push('/')

        }catch(err){
            toast.error("Sign Up error")
            console.log("sign up error ", err)
        }
    }

    async function passwordRequest({email}:PasswordRequestProps){

        
        // try{
        //     const response = await api.post('/new-password',{
        //         email
        //     })
        //     console.log(response.data)
           
        // toast.success("Email sent successfully!");
        // Router.push('/')
        // }catch(err){
        //     console.log(err)
        // }
    }
    return(
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signOut, signUp, passwordRequest}}>
            {children}
        </AuthContext.Provider>
    )
}