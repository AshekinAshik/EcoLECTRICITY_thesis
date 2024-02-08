import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import React, { useState } from 'react';
import WebLayout_V1 from '../../layout/layout_v1';
import MenuDrawer_Citizen from '../../layout/citizen_menudrawer';
import LiveChat from '../livechat';
// import Title from '../layout/title';

const EkpayPayment = () => {
    return (
        <>
            <LiveChat />

            <body className='bg-full-screen'>
                <WebLayout_V1 title={'Bill Payment'}>
                    <MenuDrawer_Citizen />
                    <div class='iframeContainer'>
                        <iframe src='https://ekpay.gov.bd/#/dedicated-biller/desco-prepaid' scrolling='no' class='iframeContent'></iframe>
                    </div>

                </WebLayout_V1>
            </body>
        </>
    );
};

export default EkpayPayment;