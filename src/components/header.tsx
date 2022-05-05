import Image from 'next/image'
import { useState } from 'react';
import { getAssetDetails } from 'blockin';
import Link from 'next/link';
import icon from '../../public/images/blockin-icon.png'
import { BlockinIcon } from './icons/blockinIcon';
import { KeyIcon } from './icons/keyIcon';
import { WalletIcon } from './icons/walletIcon';
import { LogoutIcon } from './icons/logoutIcon';
import { LoginIcon } from './icons/loginIcon';
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
        await connector?.killSession({message: 'bye'})
        // connector?.rejectSession({message: 'bye'})
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

    const loggedInBanner = <>
        <div className='bannerStatus'>
            <div>
                <KeyIcon />
                <p>Blocked In ({bannerColor})</p>
            </div>
            <div>
                <WalletIcon />
                <p>{address}</p>
            </div>
        </div>
        <button className='logout' onClick={logout}>
            <LogoutIcon /> Logout
        </button>
    </>

    const loggedOutBanner = <>
        <div className='bannerStatus'>
            <div>
                <WalletIcon />
                <p>Not BlockedIn</p>
            </div>
        </div>
        <button className='login' onClick={() => connect(setConnector, setAddress)}>
            <LoginIcon /> Connect
        </button>
    </>

    return (
        <header style={{ backgroundColor: bannerColor }}>

        <Link href={'/'}>
            <a>
                <h1 className='banner'>BL<BlockinIcon />CKIN</h1>
            </a>
        </Link>

        <div className='bottomBanner'>
            {cookies['blockedin'] || address != '' ?  
                loggedInBanner : loggedOutBanner
            }
            </div>
    </header>
    )
}

export default Header