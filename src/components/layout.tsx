import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie'
import { getColorFromMetadata } from '../permissions/permissions';
import { useWalletContext } from '../contexts/WalletContext';
import { getAssetDetails } from 'blockin';
import Link from 'next/link';
import icon from '../../public/images/blockin-icon.png'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['blockedin']);
    const [bannerColor, setBannerColor] = useState('Default');
    const { connector } = useWalletContext();

    const logout = () => {
        removeCookie('blockedin', { 'path': '/' });
        setBannerColor('Default');
    }

    useEffect(() => {
        const setBanner = async () => {
            if (cookies['blockedin']) {
                if (cookies['blockedin'] === 'none') {
                    setBannerColor('Custom');
                } else {
                    const assetInfo = await fetch('../api/getAssetDetails', {
                        method: 'post',
                        body: JSON.stringify({
                            id: cookies['blockedin']
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    }).then(res => res.json());


                    const color = await getColorFromMetadata(assetInfo['metadata-hash']);
                    if (color) {
                        setBannerColor(color.charAt(0).toUpperCase() + color.slice(1));
                    } else {
                        setBannerColor('Custom')
                    }
                }
            }
        }
        setBanner();
    }, [cookies]);


    const displayAddress = connector && connector.accounts[0] ? connector.accounts[0].substring(0, 4) + '....' + connector.accounts[0].substring(connector.accounts[0].length - 4) : undefined;
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
            <header style={{ backgroundColor: bannerColor }}>
                <Image
                    priority
                    src='/images/blockin-icon.png'
                    alt=''
                    width={100}
                    height={50}
                />
                <Link href={'/'}>
                    <a><h1>Blockin Demo</h1></a>
                </Link>

                {cookies['blockedin'] || displayAddress ?
                    <div className='authheader'>
                        <h1>{displayAddress} - Blocked In ({bannerColor})</h1>
                        <button onClick={logout}>Logout</button>
                    </div> :
                    <div className='authheader'>
                        <h1>Wallet Not Connected - Not Blocked In</h1>
                        <Link href={'/scenarios/verification'}>
                            <a><button>Login</button></a>
                        </Link>
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