import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import React, { useState } from 'react';
import WebLayout_V1 from '../../layout/layout_v1';
import MenuDrawer_Citizen from '../../layout/citizen_menudrawer';
import LiveChat from '../livechat';
// import Title from '../layout/title';

const EkpayPayment = () => {
    const router = useRouter();

    const handleChange = (e) => {
        setSignUpFormData({ ...signUpForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        signUpForm.contact = parseInt(signUpForm.contact);
        console.log(signUpForm);

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'register', signUpForm, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data);
            alert("Citizen Registration Successful!");
            router.push('citizenLogin');
        } catch (error) {
            console.error('Error Citizen Register:', error);
            alert("Citizen Registration Failed!");
        }
    };

    return (
        <>
            <LiveChat />
            
            <body className='bg-full-screen'>
                <WebLayout_V1 title={'Bill Payment'}>
                    <MenuDrawer_Citizen />
                    <div class='iframeContainer'>
                        {/* <div> */}
                        {/* <iframe src='https://ekpay.gov.bd/#/bill-payment/electricity' scrolling='no' class='iframeContent'></iframe> */}
                        <iframe src='https://ekpay.gov.bd/#/dedicated-biller/desco-prepaid' scrolling='no' class='iframeContent'></iframe>
                        {/* </div> */}
                    </div>

                </WebLayout_V1>
            </body>
        </>
    );
};

export default EkpayPayment;