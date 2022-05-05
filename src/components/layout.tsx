import Head from 'next/head'
import Header from './header'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Head>
                <title>Home | Blockin Demo</title>
                <meta name="description" content="Demo dApp for Blockin library" />

                <link rel='icon' href='/favicon.ico' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="canonical" href="https://www.kenking.dev/" />

                <meta property='og:url' content="https://www.blockin-demo.vercel.app"></meta>
                <meta property='og:type' content="website"></meta>
                <meta property="og:title" content="Home | Blockin Demo"></meta>
                <meta property="og:description" content="Demo dApp for Blockin library"></meta>
                <meta property="og:image" content="/images/blockin.png"></meta>
                <meta property="og:image:width" content="1200"></meta>
                <meta property="og:image:height" content="630"></meta>

                <meta name="twitter:card" content="summary_large_image"></meta>
                <meta property="twitter:domain" content="blockin-demo.vercel.app"></meta>
                <meta property="twitter:url" content="https://www.blockin-demo.vercel.app/"></meta>
                <meta name="twitter:title" content="Home | Blockin Demo"></meta>
                <meta name="twitter:description" content="Demo dApp for Blockin library"></meta>
                <meta name="twitter:image" content="/images/blockin.png"></meta>
            </Head>

            <Header />
            <main>
                {children}
            </main>
        </>
    )
}

export default Layout