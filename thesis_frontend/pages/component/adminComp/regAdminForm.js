import { useRouter } from 'next/router';
import axios from 'axios';
import React, { useState } from 'react';
import WebLayout_V1 from '../../layout/layout_v1';

const AdminRegForm = () => {
    const router = useRouter();

    const [signUpForm, setSignUpFormData] = useState({
        name: "",
        username: "",
        email: "",
        contact: 1,
        password: "",
    });

    const handleChange = (e) => {
        setSignUpFormData({ ...signUpForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        signUpForm.contact = parseInt(signUpForm.contact);
        console.log(signUpForm);

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'register', signUpForm, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data);
            alert("Admin Registration Successful!");
            router.push('adminLogin');
        } catch (error) {
            console.error('Error Admin Register:', error);
            alert("Admin Registration Failed!");
        }
    };

    return (
        <>
            <body className='bg-full-screen'>

                <WebLayout_V1 title={'Sign Up - Admin'}>

                    <div class="center w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 glass-container-reg">
                        <form class="space-y-6" onSubmit={handleSubmit}>
                            <h5 class="text-center mb-4 text-2xl font-bold text-white">Admin Information</h5>
                            <div class="relative z-0 w-full mb-6 group">
                                <input type="text" name="name" id="name" onChange={handleChange} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label for="name" class="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-300 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6">Name</label>
                            </div>
                            <div class="relative z-0 w-full mb-6 group">
                                <input type="text" name="username" id="username" onChange={handleChange} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label for="username" class="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-300 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6">Username</label>
                            </div>
                            <div class="relative z-0 w-full mb-6 group">
                                <input type="email" name="email" id="email" onChange={handleChange} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label for="email" class="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-300 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6">Email</label>
                            </div>
                            <div class="relative z-0 w-full mb-6 group">
                                <input type="number" name="contact" id="contact" onChange={handleChange} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label for="contact" class="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-300 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6">Contact</label>
                            </div>
                            <div class="relative z-0 w-full mb-6 group">
                                <input type="password" name="password" id="password" onChange={handleChange} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label for="password" class="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6">Password</label>
                            </div>

                            <div>
                                <center>
                                    <button type="submit" class="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">REGISTER</button>
                                    <br></br> <br></br>
                                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Already registered? <a href="adminLogin" class="text-blue-600 hover:underline dark:text-blue-500">Login</a>
                                    </div>
                                </center>
                            </div>
                        </form>
                    </div>
                </WebLayout_V1>
            </body>
        </>
    );
};

export default AdminRegForm;