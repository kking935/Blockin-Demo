import Layout from '../../components/layout'
import Head from 'next/head'
import React, { SyntheticEvent, useState } from 'react'
import { signAssetCreateTxn } from '../../wallet/sign_asset_create_txn';
import { NextPage } from 'next/types';
import { useWalletContext } from '../../contexts/WalletContext';

const UserCreates: NextPage = () => {
    const [assetAuthorization, setAssetAuthorization] = useState('');
    const { connector } = useWalletContext()

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (connector == undefined) {
            console.log("Failed to call signAssetCreateTxn because connector is undefined")
            return
        }

        signAssetCreateTxn(connector, assetAuthorization);
    }

    return (
        <Layout>
            <Head>
                <title>User Creates ASA</title>
            </Head>
            <input type="text" placeholder='Asset Authorization' onChange={e => setAssetAuthorization(e.target.value)}/>
            <button onClick={submit}> Sign Asset Create</button>
        </Layout>
    )
}

export default UserCreates