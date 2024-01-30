import { useEffect } from "react";
import { initFlowbite } from "flowbite";

const MenuDrawer_Citizen = () => {
    useEffect(() => {
        initFlowbite();
    }, [])

    return (
        <>
            {/* drawer init and toggle */}
            <div className="ontop">
                <div class="text-center">
                    <button class="glass-sidenav" type="button" data-drawer-target="drawer-disabled-backdrop" data-drawer-show="drawer-disabled-backdrop" data-drawer-backdrop="false" aria-controls="drawer-disabled-backdrop">
                        <i class="fa-solid fa-angle-right"></i>
                    </button>
                </div>

                {/* drawer component */}
                <div id="drawer-disabled-backdrop" class="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-64 dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-disabled-backdrop-label">
                    <h5 id="drawer-disabled-backdrop-label" class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Citizen Menu</h5>
                    <button type="button" data-drawer-hide="drawer-disabled-backdrop" aria-controls="drawer-disabled-backdrop" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Close menu</span>
                    </button>
                    <br></br>
                    <div class="py-4 overflow-y-auto">
                        <ul class="space-y-2 font-medium">
                            {/* <li>
                                <a href="realtime_usage_dashboard" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" id="dashboard_svg" viewBox="0 0 24 24" width="30" height="20"><path d="M5.5,21A2.5,2.5,0,0,1,3,18.5V1.5A1.5,1.5,0,0,0,1.5,0h0A1.5,1.5,0,0,0,0,1.5v17A5.5,5.5,0,0,0,5.5,24h17A1.5,1.5,0,0,0,24,22.5h0A1.5,1.5,0,0,0,22.5,21Z" /><path d="M19.5,18A1.5,1.5,0,0,0,21,16.5v-6a1.5,1.5,0,0,0-3,0v6A1.5,1.5,0,0,0,19.5,18Z" /><path d="M7.5,18A1.5,1.5,0,0,0,9,16.5v-6a1.5,1.5,0,0,0-3,0v6A1.5,1.5,0,0,0,7.5,18Z" /><path d="M13.5,18A1.5,1.5,0,0,0,15,16.5V5.5a1.5,1.5,0,0,0-3,0v11A1.5,1.5,0,0,0,13.5,18Z" /></svg>
                                    <span class="ms-3">Usage Dashboard</span>
                                </a>
                            </li> */}

                            <li>
                                <button type="button" class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-usage" data-collapse-toggle="dropdown-usage">
                                    <svg xmlns="http://www.w3.org/2000/svg" id="dashboard_svg" viewBox="0 0 24 24" width="30" height="20"><path d="M5.5,21A2.5,2.5,0,0,1,3,18.5V1.5A1.5,1.5,0,0,0,1.5,0h0A1.5,1.5,0,0,0,0,1.5v17A5.5,5.5,0,0,0,5.5,24h17A1.5,1.5,0,0,0,24,22.5h0A1.5,1.5,0,0,0,22.5,21Z" /><path d="M19.5,18A1.5,1.5,0,0,0,21,16.5v-6a1.5,1.5,0,0,0-3,0v6A1.5,1.5,0,0,0,19.5,18Z" /><path d="M7.5,18A1.5,1.5,0,0,0,9,16.5v-6a1.5,1.5,0,0,0-3,0v6A1.5,1.5,0,0,0,7.5,18Z" /><path d="M13.5,18A1.5,1.5,0,0,0,15,16.5V5.5a1.5,1.5,0,0,0-3,0v11A1.5,1.5,0,0,0,13.5,18Z" /></svg>
                                    <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Usage Dashboard</span>
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>

                                <ul id="dropdown-usage" class="hidden py-2 space-y-2">
                                    <li>
                                        <a href="realtime_usage_dashboard" class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Real-Time Usage</a>
                                    </li>
                                    <li>
                                        <a href="daily_usage_dashboard" class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Daily Usage</a>
                                    </li>
                                    <li>
                                        <a href="usage_history" class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Usage History</a>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <button type="button" class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-payment" data-collapse-toggle="dropdown-payment">
                                    <svg width="30px" height="25px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                                        <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="ic_fluent_payment_24_filled" fill="#212121" fill-rule="nonzero">
                                                <path d="M21.9883291,10.9947074 L21.9888849,16.275793 C21.9888849,17.7383249 20.8471803,18.9341973 19.4064072,19.0207742 L19.2388849,19.025793 L4.76104885,19.025793 C3.29851702,19.025793 2.10264457,17.8840884 2.01606765,16.4433154 L2.01104885,16.275793 L2.01032912,10.9947074 L21.9883291,10.9947074 Z M18.2529045,14.5 L15.7529045,14.5 L15.6511339,14.5068466 C15.2850584,14.556509 15.0029045,14.8703042 15.0029045,15.25 C15.0029045,15.6296958 15.2850584,15.943491 15.6511339,15.9931534 L15.7529045,16 L18.2529045,16 L18.3546751,15.9931534 C18.7207506,15.943491 19.0029045,15.6296958 19.0029045,15.25 C19.0029045,14.8703042 18.7207506,14.556509 18.3546751,14.5068466 L18.2529045,14.5 Z M19.2388849,5.0207074 C20.7014167,5.0207074 21.8972891,6.162412 21.9838661,7.60318507 L21.9888849,7.7707074 L21.9883291,9.4947074 L2.01032912,9.4947074 L2.01104885,7.7707074 C2.01104885,6.30817556 3.15275345,5.11230312 4.59352652,5.02572619 L4.76104885,5.0207074 L19.2388849,5.0207074 Z" id="🎨-Color">
                                                </path>
                                            </g>
                                        </g>
                                    </svg>
                                    <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Bill Payment</span>
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>

                                <ul id="dropdown-payment" class="hidden py-2 space-y-2">
                                    <li>
                                        <a href="payment_ekpay" class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">EkPay</a>
                                    </li>
                                    <li>
                                        <a href="#" class="flex-1 items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100">bKash</a>
                                        <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-normal text-gray-800 bg-green-100 rounded-full dark:bg-gray-700 dark:text-gray-300">coming soon</span>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" id="adminprofile_svg" data-name="Layer 1" viewBox="0 0 24 24" width="30" height="20"><path d="M9,12c3.309,0,6-2.691,6-6S12.309,0,9,0,3,2.691,3,6s2.691,6,6,6Zm7.086,12h-3.086s0-3.086,0-3.086l7.275-7.275c.852-.852,2.234-.852,3.086,0h0c.852,.852,.852,2.234,0,3.086l-7.275,7.275Zm-5.086,0H0v-5c0-2.757,2.243-5,5-5H13c1.145,0,2.189,.403,3.033,1.053l-5.033,5.033v3.914Z" /></svg>

                                    <span class="flex-1 ms-3 whitespace-nowrap">Profile</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>


            <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"></script>
        </>
    )
};

export default MenuDrawer_Citizen;