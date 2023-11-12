import '@/styles/globals.css'
import WebLayout from './layout/layout'
import WebHeader from './layout/header'

export default function App({ Component, pageProps }) {
  return (
    <>
    {/* <WebLayout></WebLayout> */}
      <Component {...pageProps} />

    </>
  )


}
