import Head from "next/head";
import styles from './styles.module.scss'
import { canSSRAuth } from "@/src/useful/canSSRAuth";
import { Header } from "@/src/components/Header";
import { FiUpload } from 'react-icons/fi'
import { ChangeEvent, FormEvent, useState } from "react";

import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

import Link from "next/link";

type ItemProps = {
    id: string,
    name: string
}
interface categoryProps {
    categoryList: ItemProps[]
}

export default function Product({ categoryList }: categoryProps) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const [avatarUrl, setAvatarUrl] = useState('')
    const [imageAvatar, setImageAvatar] = useState<File | null>(null)

    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return
        }

        const image = e.target.files[0]

        if (!image) {
            return
        }

        if (image.type === 'image/jpeg' || image.type === 'image/png') {

            setImageAvatar(image)
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))

        }
    }

    //Selecting a category from the list
    function handleChangeCategory(e = {} as any) {
        //console.log(categories[e.target.value])

        setCategorySelected(e.target.value)
    }
    async function handleRegisterProduct(e: FormEvent) {
        e.preventDefault()

        try {
            const data = new FormData()

            if (name === '' || price === '' || description === '') {
                toast.error('Please, complete all fields')
                return
            }
            data.append('name', name)
            data.append('price', price)
            data.append('description', description)
            data.append('category_id', categories[categorySelected].id)

            if(imageAvatar !== null){
                data.append('file', imageAvatar)

            }

            const apiClient = setupAPIClient()

            await apiClient.post('/product', data)

            toast.success('Product registed successfuly')


        } catch (err) {
            toast.error('Product register failed')
            console.log(err)
        }
        setName('')
        setPrice('')
        setDescription('')
        setImageAvatar(null)
        setAvatarUrl('')
    }

    return (
        <>
            <Head>
                <title>New Product - Pizza</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>
                    <div className={styles.productsText}>
                        <h1>New product</h1>
                        <Link href='/all-products' className={styles.linkProducts}>See all products</Link>
                        
                    </div>


                    <form className={styles.form} onSubmit={handleRegisterProduct}>

                        <label className={styles.addAvatar}>
                            <span>
                                <FiUpload size={25} color="#FFF" />
                            </span>

                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

                            {avatarUrl && (
                                <img
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt="Product image"
                                    width={250}
                                    height={250}
                                />
                            )}
                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map((item, index) => {
                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input
                            type="text"
                            placeholder="Type product name"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Type product price"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder="Product description"
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button className={styles.buttonAdd}>
                            Register
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category')

    // console.log(response.data)


    return {
        props: {
            categoryList: response.data
        }
    }
})