import { useState } from 'react';
import Link from 'next/link';
import { BlockinIcon } from './icons/blockinIcon';
import { KeyIcon } from './icons/keyIcon';
import { WalletIcon } from './icons/walletIcon';
import { LogoutIcon } from './icons/logoutIcon';
import { LoginIcon } from './icons/loginIcon';
import { connect } from '../WalletConnect';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie'
import { useWalletContext } from '../contexts/WalletContext';

const Header = () => {
    const [bannerColor, setBannerColor] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['family', 'standard', 'normal']);
    const { connector, setConnector, address, setAddress } = useWalletContext();

    const logout = async () => {
        removeCookie('family', { 'path': '/' });
        removeCookie('standard', { 'path': '/' });
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
        console.log("updating banner cuz address changed")
        console.log(address)
    }, [address, setAddress])

    const loggedIn = cookies['family'] || cookies['standard'] || cookies['normal'];

    const loggedInMessage = () => {
        const privileges = [];
        if (cookies['normal']) {
            privileges.push('Standard Access');
        }
        if (cookies['family']) {
            privileges.push('Family Plan');
        }
        if (cookies['standard']) {
            privileges.push('Standard Plan');
        }

        return privileges.join(', ');
    };


    const loggedInElem = <>
        <div className='bannerStatus'>
            <div>
                <KeyIcon />
                <p>Blocked In ({loggedInMessage()})</p>
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
            <Link href='/scenarios/samplebutton'>
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
                    <h1 className='banner'>BL<BlockinIcon />CKIN</h1>
                </a>
            </Link>


            <div className='bottomBanner'>
                {loggedIn ?
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