import Head from "next/head";
import { Header } from "@/src/components/Header";
import styles from './styles.module.scss'
import { FormEvent, useState } from "react";

import { setupAPIClient } from "@/src/services/api";
import { toast } from "react-toastify";
import { canSSRAuth } from "@/src/useful/canSSRAuth";

import { FaTrash } from 'react-icons/fa';

type ItemProps = {
    id: string,
    name: string
}
interface categoryProps {
    categoryList: ItemProps[]
}

export default function Category({ categoryList }: categoryProps) {
    console.log(categoryList)

    const [name, setName] = useState('')
    const [categories, setCategories] = useState(categoryList || [])

    async function handleRegister(e: FormEvent) {
        e.preventDefault()

        if (name === '') {
            toast.warn("Please, insert category name")
            return
        }
        const apiClient = setupAPIClient()
        const response = await apiClient.post('/category', {
            name: name
        })

        setCategories((rest) => [...rest, response.data])
        toast.success('Category registered successfully')
        setName('')

    }

    async function handleDeleteCategory(categoryId: string) {

        try {
            const api = setupAPIClient()
            const response = await api.delete(`/category/delete?category_id=${categoryId}`)

            const updatedCategories = categories.filter((item) => item.id !== categoryId);
            setCategories(updatedCategories)
            toast.success('Category deleted successfully!')
        } catch (err) {
            toast.warn('Unable to delete category!')
            console.log(err)
        }

    }
    return (
        <>
            <Head>
                <title>New Category - Pizza</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>
                    <h1>New category</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Insert new category"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button className={styles.buttonAdd} type="submit">
                            Register
                        </button>
                    </form>
                    <details>
                        <summary className={styles.categoryText}>Click here to see all Categories</summary>
                        {categories.map((item, index) => {
                            return (
                                <ul className={styles.categories} key={item.id}>
                                    <li>{item.name} <button onClick={() => handleDeleteCategory(item.id)} className={styles.trash}><FaTrash /></button></li>
                                </ul>
                            )
                        })}
                    </details>
                </main>

            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category')




    return {
        props: {
            categoryList: response.data
        }
    }
})