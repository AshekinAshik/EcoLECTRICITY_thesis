import { useRouter } from 'next/router';
import React, { useState } from 'react';
import WebLayout_V1 from '../../layout/layout_v1';
import WebHeader_V1 from '../../layout/header_v1';
import WebFooter from '../../layout/footer';
import MenuDrawer_Admin from '../../layout/admin_menudrawer';
// import Title from '../layout/title';

const LiveSupport = () => {
    return (
        <>
            <body className='bg-full-screen'>
                <WebHeader_V1 title={'Live Support'} />
                <MenuDrawer_Admin />
                <div class='iframeContainer-livesupport'>
                    {/* <div> */}
                    {/* <iframe src='https://ekpay.gov.bd/#/bill-payment/electricity' scrolling='no' class='iframeContent'></iframe> */}
                    <iframe src='https://dashboard.tawk.to/#/inbox/65b20e2c0ff6374032c4b53f/all' class='iframeContent-livesupport'></iframe>
                    {/* </div> */}
                </div>

            </body>
            <WebFooter />
        </>
    );
};

export default LiveSupport;