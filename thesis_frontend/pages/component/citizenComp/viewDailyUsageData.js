import axios from "axios";
import { useRouter } from "next/router";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import WebLayout_V1 from "../../layout/layout_v1";
import WebHeader_V1 from "../../layout/header_v1";
import WebFooter from "../../layout/footer";
import dynamic from "next/dynamic";
import MenuDrawer_Citizen from "../../layout/citizen_menudrawer";

const ViewDailyUsageData = () => {
    const router = useRouter();

    const [dailyEnergyCostData, setDailyEnergyCostData] = useState([])
    const [totalDailyEnergyData, setTotalDailyEnergyData] = useState([])
    const [totalDailyCostData, setTotalDailyCostData] = useState([])
    const [dailyEnergyCostTimeData, setDailyEnergyCostTimeData] = useState([])

    const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

    useEffect(() => {
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

    const OptionsChartLine = {
        chart: {
            id: 'apexchart-example',
            height: 550,
            // type: 'line'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        xaxis: {
            type: '',
            categories: dailyEnergyCostTimeData,
            tickAmount: 10,
        },
        yaxis: {
            tickAmount: 5,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        tooltip: {
            x: {
                format: 'dd/MM'
            },
        }
    }

    const SeriesChartLine_Energy_vs_Cost = [
        {
            name: 'Energy (kWh)',
            data: totalDailyEnergyData
        },
        {
            name: 'Cost (BDT)',
            data: totalDailyCostData
        }
    ]

    const SeriesChartLine_Cost = [
        {
            name: 'Cost (BDT)',
            data: totalDailyCostData
        },
    ]

    const SeriesChartLine_Energy = [
        {
            name: 'Energy (kWh)',
            data: totalDailyEnergyData
        },
    ]


    const showData = () => {
        const [is_Energy_vs_Cost_Hidden, setIs_Energy_vs_Cost_Hidden] = useState(true)
        const [is_Cost_Hidden, setIs_Cost_Hidden] = useState(true)
        const [is_Energy_Hidden, setIs_Energy_Hidden] = useState(true)

        const show_Energy_vs_Cost = () => {
            setIs_Energy_vs_Cost_Hidden(false);
            setIs_Cost_Hidden(true);
            setIs_Energy_Hidden(true);
        };

        const show_Cost = () => {
            setIs_Energy_vs_Cost_Hidden(true);
            setIs_Cost_Hidden(false);
            setIs_Energy_Hidden(true);
        };

        const show_Energy = () => {
            setIs_Energy_vs_Cost_Hidden(true);
            setIs_Cost_Hidden(true);
            setIs_Energy_Hidden(false);
        };

        // setInterval(getData, 10000)
        // console.log(usageData)
        if (dailyEnergyCostData != 0) {
            return (
                <>
                    {/* <SessionCheck /> */}

                    <body className="bg-light">
                        <WebHeader_V1 title={'Dashboard - Daily Energy-Cost'} />
                        <MenuDrawer_Citizen />

                        <div className="body-topnbottom">
                            <center>
                                <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-2xl lg:text-4xl dark:text-white"> Daily Total <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Energy-Cost</mark> Data </h4>
                                <br></br>
                                <button type="button" onClick={show_Energy_vs_Cost} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Energy - Cost</button>
                                <button type="button" onClick={show_Cost} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Cost</button>
                                <button type="button" onClick={show_Energy} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Energy</button>
                                <br></br> <br></br>

                                {/* <div className="graph-container">
                                    <div className="graph-content">
                                        <Chart options={OptionsChartLine} series={SeriesChartLine_Energy_vs_Cost} type="line" height={500} width={1400} />
                                    </div>
                                </div> */}

                                <div className="graph-container">
                                    {is_Energy_vs_Cost_Hidden ? null : (

                                        <div className="graph-content">
                                            <Chart options={OptionsChartLine} series={SeriesChartLine_Energy_vs_Cost} type="area" height={500} width={1400} />
                                        </div>

                                    )}

                                    {is_Cost_Hidden ? null : (

                                        <div className="graph-content">
                                            <Chart options={OptionsChartLine} series={SeriesChartLine_Cost} type="area" height={500} width={1400} />
                                        </div>

                                    )}

                                    {is_Energy_Hidden ? null : (

                                        <div className="graph-content">
                                            <Chart options={OptionsChartLine} series={SeriesChartLine_Energy} type="area" height={500} width={1400} />
                                        </div>

                                    )}
                                </div>
                                <br></br>

                                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table class="w-full text-sm text-center text-gray-800 dark:text-gray-400">
                                        <thead class="text-extrabold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="px-6 py-5">
                                                    Energy (kWh)
                                                </th>
                                                <th scope="col" class="px-6 py-5">
                                                    Cost (BDT)
                                                </th>
                                                <th scope="col" class="px-6 py-5">
                                                    Time
                                                </th>
                                                <th scope="col" class="px-6 py-5">
                                                    Citizen ID
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {dailyEnergyCostData.map((item, index) => {
                                                const count = index + 1; // Increment the count for each iteration starting from 1
                                                return (
                                                    <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                        <td class="px-6 py-2">{item.energy}</td>
                                                        <td class="px-6 py-2">{item.cost}</td>
                                                        <td class="px-6 py-2">{convertDate(item.time)}</td>
                                                        <td class="px-6 py-2">{item.c_id}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </center>
                        </div>
                        <WebFooter />
                    </body>
                </>

            )
        } else {
            return (
                <>
                    <body className="bg-full-screen">
                        <WebLayout_V1 title="Citizen Usage Data">

                            <div id="marketing-banner" tabindex="-1" class="center fixed z-50 flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 -translate-x-1/2 bg-white border border-gray-100 rounded-lg shadow-sm lg:max-w-7xl left-1/2 top-6 dark:bg-gray-700 dark:border-gray-600">
                                <div class="flex flex-col items-start mb-3 me-4 md:items-center md:flex-row md:mb-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" id="no_usage_alert" data-name="no usage" viewBox="0 0 24 24" width="30" height="23"><path d="M12,4a8.009,8.009,0,0,0-8,8c.376,10.588,15.626,10.585,16,0A8.009,8.009,0,0,0,12,4Zm0,14C4.071,17.748,4.072,6.251,12,6,19.929,6.252,19.928,17.749,12,18Zm1-9v3a1,1,0,0,1-2,0V9A1,1,0,0,1,13,9Zm11,3a12.026,12.026,0,0,1-2.743,7.637,1,1,0,0,1-1.543-1.274,10.052,10.052,0,0,0,0-12.726,1,1,0,0,1,1.543-1.274A12.026,12.026,0,0,1,24,12ZM4.286,18.363a1,1,0,0,1-1.542,1.274,12.065,12.065,0,0,1,0-15.274A1,1,0,0,1,4.286,5.637,10.052,10.052,0,0,0,4.286,18.363ZM13,15a1,1,0,0,1-2,0A1,1,0,0,1,13,15Z" /></svg>

                                    <p class="text-center text-sm font-semibold text-red-700 dark:text-gray-400">No Usage Data to Show</p>
                                </div>
                                <div class="flex items-center flex-shrink-0">
                                    <button data-dismiss-target="#marketing-banner" type="button" onClick={() => router.push('citizens')} class="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close banner</span>
                                    </button>
                                </div>
                            </div>
                            {/* <p class="text-center text-red-700"> No Usage Data to Show </p> */}
                        </WebLayout_V1>
                    </body>
                </>
            )
        }
    };

    return (
        <div>
            {showData()}
        </div>
    )
};
export default ViewDailyUsageData;