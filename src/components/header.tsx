import Image from 'next/image'
import { useState } from 'react';
import Link from 'next/link';
import { BlockinIcon, KeyIcon, WalletIcon, LogoutIcon, LoginIcon } from './icons';
import { connect } from '../WalletConnect';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie'
import { getColorFromMetadata } from '../permissions/permissions';
import { useWalletContext } from '../contexts/WalletContext';

const Header = () => {
    const [bannerColor, setBannerColor] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['blockedin']);
    const { connector, setConnector, address, setAddress } = useWalletContext();

    const logout = async () => {
        removeCookie('blockedin', { 'path': '/' });
        setBannerColor('');
    }

    const disconnect = async () => {
        await logout();
        await connector?.killSession({ message: 'bye' })
        connector?.rejectSession({ message: 'bye' })
        setConnector(undefined)
        setAddress('')
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

    useEffect(() => {
        console.log("updating banner cuz address changed")
        console.log(address)
    }, [address, setAddress])

    const loggedInElem = <>
        <div className='bannerStatus'>
            <div>
                <KeyIcon />
                <p>Blocked In ({bannerColor})</p>
            </div>
            <button className='logout' onClick={logout}>
                <LogoutIcon /> Logout
            </button>
        </div>
    </>

    const connectedElem = <>
        <div className='connectStatus'>
            <div>
                <WalletIcon />
                <p>{address}</p>
            </div>
            <button className='logout' onClick={disconnect}>
                <LogoutIcon /> Disconnect
            </button>
        </div>
    </>;

    const disconnectedElem = <>
        <div className='connectStatus'>
            <div>
                <WalletIcon />
                <p>Not Connected</p>
            </div>
            <button className='login' onClick={() => connect(setConnector, setAddress)}>
                <LoginIcon /> Connect
            </button>
        </div>

    </>;

    const loggedOutElem = <>
        <div className='bannerStatus'>
            <div>
                <WalletIcon />
                <p>Not Blocked In</p>
            </div>
            <Link  href='/scenarios/verification'>
                <a className='login'>
                    <LoginIcon /> Login
                </a>
            </Link>
        </div>
    </>

    return (
        <header style={{ backgroundColor: bannerColor }}>

            <Link href={'/'}>
                <a>
                    <h1 className='banner'>BL<BlockinIcon dimensions='40pt' />CKIN</h1>
                </a>
            </Link>


            <div className='bottomBanner'>
                {cookies['blockedin'] ?
                    loggedInElem : loggedOutElem
                }
                {address != '' ?
                    connectedElem : disconnectedElem
                }
            </div>



        </header >
    )
}

export default Header