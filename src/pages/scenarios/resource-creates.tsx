import Layout from '../../components/layout'
import Head from 'next/head'
import React from 'react'
import { signOptIn } from '../../wallet/sign_opt_in';
import { NextPage } from 'next/types';
import { useWalletContext } from '../../contexts/WalletContext';

const ResourceCreates: NextPage = () => {
    const { connector } = useWalletContext()

    const handleSignOptIn = () => {
        if (connector == undefined) {
            console.log("Failed to call signOptIn because connector is undefined")
            return
        }

        signOptIn(connector)
    }

    return (
        <Layout>
            <Head>
                <title>Resource Creates ASA</title>
            </Head>
            <button onClick={handleSignOptIn}>Sign Opt In</button>
        </Layout>
    )
}

export default ResourceCreates