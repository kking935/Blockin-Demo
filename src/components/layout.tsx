import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie'
import { getColorFromMetadata } from '../permissions/permissions';
import { useWalletContext } from '../contexts/WalletContext';
import { getAssetDetails } from 'blockin';
import Link from 'next/link';


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['blockedin']);
    const [bannerColor, setBannerColor] = useState('');
    const { connector } = useWalletContext();

    const logout = () => {
        removeCookie('blockedin', { 'path': '/' });
        setBannerColor('');
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


    const displayAddress = connector && connector.accounts[0] ? connector.accounts[0].substring(0, 4) + '....' + connector.accounts[0].substring(connector.accounts[0].length - 4) : 'Wallet Not Connected';
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header style={{ backgroundColor: bannerColor }}>
                <Link href={'/'}>
                    <a><h1>Blockin Demo</h1></a>
                </Link>

                {cookies['blockedin'] ?
                    <div className='authheader'>
                        <h1>{displayAddress} - Blocked In ({bannerColor})</h1>
                        <button onClick={logout}>Logout</button>
                    </div> :
                    <div className='authheader'>
                        <h1>{displayAddress} - Not Blocked In</h1>
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