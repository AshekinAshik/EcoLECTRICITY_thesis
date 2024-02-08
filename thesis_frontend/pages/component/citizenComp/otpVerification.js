import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebLayout_V1 from '../../layout/layout_v1';
// import SessionCheck from '../utils/sessionCheck';

const CitizenLoginForm = () => {
    const router = useRouter()

    const [error, setError] = useState('')
    const [OTPData, setOTPData] = useState({
        otp: '',
    })

    const [generatedOTP, setGeneratedOTP] = useState(null)

    useEffect(() => {
        console.log("calling from useEffect OTP")

        getGeneratedOTP()
    }, [])

    const getGeneratedOTP = async () => {
        try {
            const response_otp = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'generateOTP',
                {
                    withCredentials: true
                });
            const genOTP = response_otp.data
            setGeneratedOTP(genOTP)
            // console.log(response_otp.data)
        } catch (error) {
            console.error('Error Getting Generated OTP: ', error);
        }
    }

    const handleChange = (e) => {
        setOTPData({ ...OTPData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputOTP = parseInt(OTPData.otp)
        console.log("Input OTP: " + typeof inputOTP + " " + inputOTP + " Generated OTP: " + typeof generatedOTP + " " + generatedOTP)

        if (!OTPData.otp) {
            setError("provide the OTP from your registered email address!")
        } else if (inputOTP === generatedOTP) {
            router.push('realtime_usage_dashboard')
            alert("OTP matched!")
        } else {
            alert("OTP didn't match. Try again!")
        }
    };

    return (
        <>
            {/* <SessionCheck /> */}

            <body className='bg-full-screen'>
                <WebLayout_V1 title={'Login - Citizen'}>
                    <div class="center w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 glass-container-login">
                        <form class="space-y-6" onSubmit={handleSubmit}>
                            <h5 class="text-center mb-4 text-2xl font-bold text-white">Insert OTP from Email</h5>
                            <div>
                                <label for="otp" class="block mb-2 text-sm font-medium text-white dark:text-white">6 Digit OTP</label>
                                <input type="text" name="otp" id="otp" placeholder="******" onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>
                            <div>
                                {error && <p class="text-center font-bold text-red-700">{error}</p>}
                            </div>
                            <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <center> Not registered? <a href="citizenRegistration" class="text-blue-600 hover:underline dark:text-blue-500">Create account</a> </center>
                            </div>
                        </form>
                    </div>
                </WebLayout_V1>
            </body >
        </>
    )
};

export default CitizenLoginForm;