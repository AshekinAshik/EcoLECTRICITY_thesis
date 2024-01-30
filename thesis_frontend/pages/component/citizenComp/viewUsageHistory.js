import axios from "axios";
import { useRouter } from "next/router";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import WebLayout_V1 from "../../layout/layout_v1";
import WebHeader_V1 from "../../layout/header_v1";
import WebFooter from "../../layout/footer";
import dynamic from "next/dynamic";
import MenuDrawer_Citizen from "../../layout/citizen_menudrawer";
import LiveChat from "../livechat";

const ViewUsageHistoryData = () => {
    const router = useRouter();

    const [date, setDate] = useState()
    const [usageByDate, setUsageByDate] = useState([])
    const [energycostByDate, setEnergycostByDate] = useState([])
    const [activeDiv, setActiveDiv] = useState('')

    const [dailyEnergyCostData, setDailyEnergyCostData] = useState([])
    const [totalDailyEnergyData, setTotalDailyEnergyData] = useState([])
    const [totalDailyCostData, setTotalDailyCostData] = useState([])
    const [dailyEnergyCostTimeData, setDailyEnergyCostTimeData] = useState([])

    const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

    useEffect(() => {
        console.log('useEffect in ViewUsageHistory')
        getData();
    }, []);

    const convertDate = (time) => {
        const date = new Date(time)
        const convertedTime = date.toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
        return convertedTime
    }

    const getData = async () => {
        const totalEnergies = []
        const totalCosts = []
        const daily_en_cost_times = []

        try {
            const response_daily_energy_cost = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'daily_energy_cost',
                {
                    withCredentials: true
                })
            setDailyEnergyCostData(response_daily_energy_cost.data)
            console.log("Response Daily Energy-Cost: ", response_daily_energy_cost)

            // const timeInterval = 10
            response_daily_energy_cost.data.map(item => {
                console.log("Item Daily Energy-Cost: ", item)

                totalEnergies.push(item.energy)
                totalCosts.push(item.cost)
                daily_en_cost_times.push(convertDate(item.time))
            })
            setTotalDailyEnergyData(totalEnergies)
            setTotalDailyCostData(totalCosts)
            setDailyEnergyCostTimeData(daily_en_cost_times)
        } catch (error) {
            console.error(error);
        }
    };

    const handleDatePicker = (e) => {
        setDate(e.target.value);
    }

    const getUsageByDate = async (e) => {
        e.preventDefault()

        const response_usage_bydate = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'usage/' + date, {
            withCredentials: true
        });
        setUsageByDate(response_usage_bydate.data)
        console.log("Response Usage by Date: ", response_usage_bydate)
    }

    const getEnergyCostByDate = async (e) => {
        e.preventDefault()

        const response_energycost_bydate = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'energy_cost/' + date, {
            withCredentials: true
        });
        setEnergycostByDate(response_energycost_bydate.data)
        console.log("Response Energy_Cost by Date: ", response_energycost_bydate)
    }

    const handleActiveButton = (active_DivId) => {
        setActiveDiv(active_DivId);
    };

    return (
        <>
            {/* <SessionCheck /> */}

            <LiveChat />

            <body className="bg-light">
                <WebHeader_V1 title={'Dashboard - Usage History'} />
                <MenuDrawer_Citizen />

                <div className="body-topnbottom">
                    <center>
                        <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-2xl lg:text-4xl dark:text-white"> Available <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Usage</mark> History </h4>

                        <br></br>
                        <button type="button" onClick={() => handleActiveButton('current_power_voltage')} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Current - Power - Voltage</button>
                        <button type="button" onClick={() => handleActiveButton('energy_cost')} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Energy - Cost</button>
                        <br></br> <br></br>

                        <div id="current_power_voltage" style={{ display: activeDiv === 'current_power_voltage' ? 'block' : 'none' }}>
                            <input type="date" onChange={handleDatePicker} />
                            <button type="button" onClick={getUsageByDate} class="text-white bg-green-300 hover:bg-green-500 font-medium rounded-lg text-sm px-2 py-3.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </button>
                            <br></br>

                            <div class="relative overflow-x-auto">
                                <table class="w-5/6 text-sm text-center text-gray-800 dark:text-gray-400 shadow-md" style={{ borderRadius: '5px' }}>
                                    <thead class="text-extrabold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="px-6 py-5">
                                                Current (amp)
                                            </th>
                                            <th scope="col" class="px-6 py-5">
                                                Power (kW)
                                            </th>
                                            <th scope="col" class="px-6 py-5">
                                                Voltage (v)
                                            </th>
                                            <th scope="col" class="px-6 py-5">
                                                Time (date-time)
                                            </th>
                                            <th scope="col" class="px-6 py-5">
                                                Citizen ID
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Array.isArray(usageByDate) && usageByDate.length > 0 ? (
                                            usageByDate.map((item) => (
                                                <tr key={item.c_id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                    <td class="px-6 py-2">{item.current}</td>
                                                    <td class="px-6 py-2">{item.power / 1000}</td>
                                                    <td class="px-6 py-2">{item.voltage}</td>
                                                    <td class="px-6 py-2">{convertDate(item.time)}</td>
                                                    <td class="px-6 py-2">{item.c_id}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-white text-2xl text-center py-4">No data for this date</td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>

                        <div id="energy_cost" style={{ display: activeDiv === 'energy_cost' ? 'block' : 'none' }}>
                            <input type="date" onChange={handleDatePicker} />
                            <button type="button" onClick={getEnergyCostByDate} class="text-white bg-green-300 hover:bg-green-500 font-medium rounded-lg text-sm px-2 py-3.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </button>
                            <br></br>

                            <div class="relative overflow-x-auto">
                                <table class="w-5/6 text-sm text-center text-gray-800 dark:text-gray-400 shadow-md" style={{ borderRadius: '5px' }}>
                                    <thead class="text-extrabold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="px-6 py-5">
                                                Energy (kWh)
                                            </th>
                                            <th scope="col" class="px-6 py-5">
                                                Cost (BDT)
                                            </th>
                                            <th scope="col" class="px-6 py-5">
                                                Time (date-time)
                                            </th>
                                            <th scope="col" class="px-6 py-5">
                                                Citizen ID
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Array.isArray(energycostByDate) && energycostByDate.length > 0 ? (
                                            energycostByDate.map((item) => (
                                                <tr key={item.c_id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                    <td class="px-6 py-2">{item.energy}</td>
                                                    <td class="px-6 py-2">{item.cost / 1000}</td>
                                                    <td class="px-6 py-2">{convertDate(item.time)}</td>
                                                    <td class="px-6 py-2">{item.c_id}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-white text-2xl text-center py-4">No data for this date</td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </center>
                </div>
            </body>
            <WebFooter />
        </>
    )
};

export default ViewUsageHistoryData;