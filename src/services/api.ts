import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './Errors/AuthTokenError'
import { signOut } from '../contexts/authContext'

export function setupAPIClient(ctx = {}){
    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: 'https://pizza-backend-three.vercel.app',
        headers:{
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError) => {
        if(error.response?.status === 401){
            if(typeof window !== undefined){
                signOut()
            }else{
                return Promise.reject(new AuthTokenError)
            }

        }

        return Promise.reject(error)
    })

    return api
}