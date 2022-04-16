import Head from 'next/head'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>Blockin Demo</h1>
      </header>
      <main>
        {children}
      </main>
    </>
  )
}

export default Layout