import Head from "next/head";
import styles from './styles.module.scss'
import { canSSRAuth } from "@/src/useful/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";
import { useState, useEffect } from "react";
import { api } from "@/src/services/apiClient";
import { FaTrash } from 'react-icons/fa';
import { Header } from "@/src/components/Header";
import { toast } from "react-toastify";


type CategoryItemProps = {
    id: string,
    name: string,
    products: ProductItemProps[]
}

type ProductItemProps = {
    id: string,
    name: string,
    price: string | number,
    description: string
    category_id: string
}

interface CategoryProps {
    categoryList: CategoryItemProps[]
}
export default function AllProducts({ categoryList }: CategoryProps) {
    const [categories, setCategories] = useState(categoryList || [])

    useEffect(() => {
        async function handleAllProducts() {
            try {
                const categoryIds = categories.map((item) => item.id).join(",");

                const response = await api.get(`/category/product?category_id=${categoryIds}`);
                console.log('response: ', response.data)

                const updatedCategories = response.data.map((categoryProducts: ProductItemProps[], index: number) => ({
                    ...categories[index],
                    products: categoryProducts,
                }));

                setCategories(updatedCategories)


            } catch (err) {
                console.log('Erro na requisição da API:', err);
            }
        }

        handleAllProducts()
        console.log(categories)
    }, []);


    async function handleDeleteProduct(product_id: string) {
        try {
            const response = await api.delete(`/product/delete?product_id=${product_id}`)
            const updatedProducts = categories.map((category) => ({
                ...category,
                products: category.products.filter((product) => product.id !== product_id),
            }));
            setCategories(updatedProducts)
            console.log(response.data)
            toast.success('Product deleted successfully')
        } catch (err) {
            console.log('error: ', err)
            toast.error("Unable to delete product")
        }
    }

    return (
        <>
            <Head>
                <title>All Products</title>
            </Head>
            <Header />

            <div className={styles.container}>
                <h1>All products</h1>
                <div className={styles.box}>

                    {categories.map((category, index) => {
                        return (
                            <div key={category.id} className={styles.categoryList}>
                                <h2>{category.name}</h2>
                                <ul className={styles.productList}>
                                    {category.products?.map((product) => {
                                        return (
                                            <li key={product.id} className={styles.productDetails}>
                                                <h3>----------------------------</h3>
                                                <p><strong>Product name:</strong> {product.name} - <button onClick={() => handleDeleteProduct(product.id)}><FaTrash /></button></p>
                                                <p><strong>Product price:</strong> ${product.price}</p>
                                                <p><strong>Product description:</strong> {product.description}</p>
                                                <h3>----------------------------</h3>
                                            </li>
                                        )
                                    })}
                                </ul>

                            </div>

                        )

                    })}
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const responseCategory = await apiClient.get('/category')


    return {
        props: {
            categoryList: responseCategory.data
        }
    }
})