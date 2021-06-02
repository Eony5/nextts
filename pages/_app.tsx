import { AppProps } from 'next/app'
import Layout from './layout'
import '../styles/global.scss'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
