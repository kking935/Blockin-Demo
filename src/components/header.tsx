/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image'
import { useState } from 'react';
import Link from 'next/link';
import { BlockinIcon, KeyIcon, WalletIcon, LogoutIcon, LoginIcon } from './icons';
import { connect } from '../chain_handlers_frontend/algorand/WalletConnect';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie'
import { getColorFromMetadata } from '../permissions/permissions';
import { SignChallengeButton } from './buttons/sign_challenge_button';
import { getChallenge } from '../chain_handlers_frontend/backend_connectors';
import { useChainContext } from '../chain_handlers_frontend/ChainContext';
import { useAlgorandContext } from '../chain_handlers_frontend/algorand/AlgorandContext';

const Header = () => {
    const [bannerColor, setBannerColor] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['blockedin', 'stripes', 'gradient']);
    const [challenge, setChallenge] = useState('');
    const { connector, setConnector } = useAlgorandContext();
    const { address, setAddress, chain, setConnected, setOwnedAssetIds } = useChainContext()

    const logout = async () => {
        removeCookie('blockedin', { 'path': '/' });
        removeCookie('stripes', { 'path': '/' });

        removeCookie('gradient', { 'path': '/' });
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

    useEffect(() => {
        updateChallenge();
    }, [connector, chain]);

    const updateChallenge = async () => {
        if (address) {
            const blockinChallenge = await getChallenge(chain, address, []);
            console.log(blockinChallenge);
            setChallenge(blockinChallenge);
        }
    }

    return (
        <>
            <header style={{ backgroundColor: bannerColor }}>

                <Link href={'/'}>
                    <a>
                        <h1 className='banner'>BL<BlockinIcon dimensions='40pt' />CKIN</h1>
                    </a>
                </Link>


                {/* <div className='bottomBanner'>
                    {cookies['blockedin'] ?
                        loggedInElem : loggedOutElem
                    }
                    {address ?
                        connectedElem : disconnectedElem
                    }
                </div> */}
                <SignChallengeButton assets={[]} cookieValue={'none'} challengeParams={''} />
                
            </header >


            {cookies['stripes'] && <div style={{
                width: '100%', height: 25,
                backgroundColor: 'blue'
                // background: 'repeating-linear-gradient(45deg, red, red 10px, white 10px, white 20px)'
            }}></div>}

            {cookies['gradient'] && <div style={{
                width: '100%', height: 25,
                backgroundColor: 'red'
                // background: 'linear-gradient(black, blue)'
            }}></div>}
        </>
    )
}

export default Header;