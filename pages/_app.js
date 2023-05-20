/* pages/_app.js */
import '../styles/globals.css'
import styles from '../styles/Home.module.css'
import "@material-tailwind/react/tailwind.css";
import Link from 'next/link'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


function MyApp({ Component, pageProps }) {
  return (
    <DndProvider backend={HTML5Backend}>
    <div className={styles.container}>
  
      <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
      />
      <nav className="border-b p-6">
        <div className="text-5xl font-extrabold mb-4 flex justify-end">Flippando</div>
        <div className="flex justify-end">
          <Link href="/">
            <a className="mr-4 text-blue-800">
              Flip
            </a>
          </Link>
          <Link href="/my-flips">
            <a className="mr-6 text-blue-800">
              My Flips
            </a>
          </Link>
          <Link href="/playground">
            <a className="mr-6 text-blue-800">
              Playground
            </a>
          </Link>
          <Link href="/my-art">
            <a className='mr-6 text-blue-800'>
              My art
            </a>
          </Link>
        </div>
      </nav>

      <Component {...pageProps} />
    </div>
    </DndProvider>
  )
}

export default MyApp