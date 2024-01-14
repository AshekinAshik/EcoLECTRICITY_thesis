import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";


const WebHeader_V1 = ({title}) => {
    useEffect(() => {
        initFlowbite();
    }, [])

    return (
        <>
            {/* This is used to use the Fontawesome fonts via online link */}
            <Script src="https://kit.fontawesome.com/94d4ff1f5f.js" crossorigin="anonymous" />

            <Head>
                <title> {title} </title>
            </Head>

            <nav class="glass-header">
                <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="../EcoLECTRICITY" class="flex items-center">
                        <img src="/eco.png" class="h-8 mr-3" alt="Flowbite Logo" />
                        <span class="text-white self-center text-2xl font-semibold whitespace-nowrap dark:text-white">EcoLECTRICITY</span>
                    </a>
                    <div class="flex md:order-2">
                        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button"> Get Started <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg>
                        </button>

                        <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <a href="/admin/adminLogin" class="text-center block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-blue">
                                        <i class="fa-solid fa-briefcase"></i> Admin
                                    </a>
                                </li>
                                <li>
                                    <a href="/citizen/citizenLogin" class="text-center block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-blue">
                                        <i class="fa-solid fa-user"></i> Citizen
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"></script>
        </>
    )
};

export default WebHeader_V1;