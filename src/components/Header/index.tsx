import { useContext  } from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'
import { FiLogOut } from 'react-icons/fi'
import { AuthContext } from '@/src/contexts/authContext'

export function Header(){

    const { signOut } = useContext(AuthContext)

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <img src='/logo.svg' width={200} height={130} />
                   
                </Link>
                <nav className={styles.menuNav}>
                    <Link legacyBehavior href="/category">
                        <a>Category</a>
                    </Link>
                    <Link legacyBehavior href="/product">
                        <a>Product</a>
                    </Link>
                    <button onClick={signOut}>
                        <FiLogOut color='#fff' size={24}/>
                    </button>
                </nav>
            </div>
            
        </header>
    )
}