import Head from 'next/head'
import { useCookies } from 'react-cookie'
import { simulatedOwnedAssetColors, simulatedOwnedAssetHTMLColors, simulatedOwnedAssets } from '../permissions/permissions';


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['blockedin']);

    const logout = () => {
        removeCookie('blockedin', { 'path': '/' });
    }

    let bannerColor = undefined;
    let bannerColorReadable = undefined;
    if (cookies['blockedin']) {
        const idx = Number(cookies['blockedin']) % 5;
        bannerColor = simulatedOwnedAssetHTMLColors[idx];
        bannerColorReadable = simulatedOwnedAssetColors[idx];
    }

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header style={{ backgroundColor: bannerColor }}>
                <a href='/'><h1>Blockin Demo</h1></a>

                {cookies['blockedin'] ?
                    <div className='authheader'>
                        <h1>Blocked In ({bannerColorReadable ? bannerColorReadable : 'Custom'})</h1>
                        <button onClick={logout}>Logout</button>
                    </div> :
                    <div className='authheader'>
                        <h1>Not Blocked In</h1>
                        <a href='/scenarios/verification'><button>Login</button></a>
                    </div>
                }
            </header>
            <main>
                {children}
            </main>
        </>
    )
}

export default Layout