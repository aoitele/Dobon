import React from 'react'
import styles from './layout.module.scss'

const Layout:React.FC = ({children}:any) => (
    <div className={styles.container}>
        <main className={styles.main}>
        {children}
        </main>
        <footer>
        </footer>
    </div>
    )

export default Layout
