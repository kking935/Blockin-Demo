import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie'
import { getColorFromMetadata } from '../permissions/permissions';
import { getAsset } from '../wallet/sign_challenge';


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['blockedin']);
    const [bannerColor, setBannerColor] = useState('');

    const logout = () => {
        removeCookie('blockedin', { 'path': '/' });
        setBannerColor('');
    }

    useEffect(() => {
        const setBanner = async () => {
            if (cookies['blockedin']) {
                const assetInfo = await getAsset(cookies['blockedin']);
                const color = await getColorFromMetadata(assetInfo['metadata-hash']);
                if (color) {
                    setBannerColor(color.charAt(0).toUpperCase() + color.slice(1));
                } else {
                    setBannerColor('Custom')
                }
            }
        }
        setBanner();
    }, [cookies]);



    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header style={{ backgroundColor: bannerColor }}>
                <a href='/'><h1>Blockin Demo</h1></a>

                {cookies['blockedin'] ?
                    <div className='authheader'>
                        <h1>Blocked In ({bannerColor})</h1>
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