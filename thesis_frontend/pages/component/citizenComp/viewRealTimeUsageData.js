import axios from "axios";
import { useRouter } from "next/router";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import WebLayout_V1 from "../../layout/layout_v1";
import WebHeader_V1 from "../../layout/header_v1";
import WebFooter from "../../layout/footer";
import dynamic from "next/dynamic";
import MenuDrawer_Citizen from "../../layout/citizen_menudrawer";

const ViewRealTimeUsageData = () => {
    const router = useRouter();

    const [usageData, setUsageData] = useState([]);
    const [powerData, setPowerData] = useState([])
    const [currentData, setCurrentData] = useState([])
    const [timeData, setTimeData] = useState([])
    const [voltageData, setVoltageData] = useState([])

    const [energyCostData, setEnergyCostData] = useState([])
    const [energyData, setEnergyData] = useState([])
    const [costData, setCostData] = useState([])
    const [energycostTimeData, setEnergyCostTimeData] = useState([])

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
        const currents = []
        const powers = []
        const times = []
        const voltages = []
        const costs = []
        const energies = []
        const en_cost_times = []

        try {
            const response_dashboard = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'dashboard',
                {
                    withCredentials: true
                })
            setUsageData(response_dashboard.data)
            console.log("response dashboard: ", response_dashboard)

            const response_energycost = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'energy_cost',
                {
                    withCredentials: true
                })
            setEnergyCostData(response_energycost.data)
            console.log("response energycost: ", response_energycost)

            // const timeInterval = 10
            response_dashboard.data.map(item_dashboard => {
                console.log("item dashboard: ", item_dashboard)

                currents.push(item_dashboard.current)

                //Retrieving Power data and converting to kW
                let power_kWh = (item_dashboard.power) / 1000
                power_kWh = Number(power_kWh.toFixed(2))
                powers.push(power_kWh)
                // powers.push((item_dashboard.power)/1000)
                // powers.push(item_dashboard.power)

                times.push(convertDate(item_dashboard.time))
                // times.push(item_dashboard.time)

                voltages.push(item_dashboard.voltage)

                //generating random unit cost between BDT 4.6 to 6.7
                // const randomDecimal = Math.random()
                // let randomCost = 4.6 + randomDecimal * (6.7 - 4.6)

                //calculating consumed energy per timeInterval
                // const power = item.current * item.voltage
                // let energy = (power / 1000) * (timeInterval / 3600)
                // energy = Number(energy.toFixed(4))

                //calculating consumed cost per timeInterval
                // let cost = energy * randomCost
                // cost = Number(cost.toFixed(4))

                // energies.push(energy)
                // unitCosts.push(cost)
            })
            setPowerData(powers)
            setCurrentData(currents)
            setTimeData(times)
            setVoltageData(voltages)

            response_energycost.data.map(item_energycost => {
                console.log("item energycost: ", item_energycost)

                energies.push(item_energycost.energy)
                costs.push(item_energycost.cost)
                en_cost_times.push(item_energycost.time)
            })
            setEnergyData(energies)
            setCostData(costs)
            setEnergyCostTimeData(en_cost_times)
        } catch (error) {
            console.error(error);
        }
    };

    // return (
    //     <>
    //         {/* <SessionCheck /> */}

    //         <br></br> <br></br><br></br>
    //         <body>
    //             <center>

    //                 <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-white"> All Available <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Usage</mark> Data </h4>
    //                 <br></br>

    //                 <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    //                     <table class="w-full text-sm text-center text-gray-800 dark:text-gray-400">
    //                         <thead class="text-extrabold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
    //                             <tr>
    //                                 <th scope="col" class="px-6 py-5">
    //                                     Log ID
    //                                 </th>
    //                                 <th scope="col" class="px-6 py-5">
    //                                     Power
    //                                 </th>
    //                                 <th scope="col" class="px-6 py-5">
    //                                     Current
    //                                 </th>
    //                                 <th scope="col" class="px-6 py-5">
    //                                     Voltage
    //                                 </th>
    //                                 <th scope="col" class="px-6 py-5">
    //                                     Time
    //                                 </th>
    //                                 <th scope="col" class="px-6 py-5">
    //                                     Citizen ID
    //                                 </th>
    //                             </tr>
    //                         </thead>

    //                         <tbody>
    //                             {usageData.map((item, index) => (
    //                                 <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
    //                                     <td class="px-6 py-2">{item.log_id}</td>
    //                                     <td class="px-6 py-2">{item.power}</td>
    //                                     <td class="px-6 py-2">{item.current}</td>
    //                                     <td class="px-6 py-2">{item.voltage}</td>
    //                                     <td class="px-6 py-2">{item.time}</td>
    //                                     <td class="px-6 py-2">{item.c_id}</td>
    //                                     <td class="px-6 py-2 text-right">
    //                                         <Link href={"" + item.c_id}>
    //                                             <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> Details </button>
    //                                         </Link>
    //                                     </td>
    //                                 </tr>
    //                             ))}
    //                         </tbody>
    //                     </table>
    //                 </div>
    //             </center>
    //         </body>

    //     </>
    // );

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
            categories: timeData,
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
            data: energyData
        },
        {
            name: 'Cost (BDT)',
            data: costData
        }
    ]

    const SeriesChartLine_Cost = [
        {
            name: 'Cost (BDT)',
            data: costData
        },
    ]

    const SeriesChartLine_Current_vs_Power = [
        {
            name: 'Current (amp)',
            data: currentData
        },
        {
            name: 'Power (kilowatt)',
            data: powerData
        }
    ]

    const showData = () => {
        const [is_Energy_vs_Cost_Hidden, setIs_Energy_vs_Cost_Hidden] = useState(true)
        const [is_Cost_Hidden, setIs_Cost_Hidden] = useState(true)
        const [is_Current_vs_Power_Hidden, setIs_Current_vs_Power_Hidden] = useState(true)

        const show_Energy_vs_Cost = () => {
            setIs_Energy_vs_Cost_Hidden(false);
            setIs_Cost_Hidden(true);
            setIs_Current_vs_Power_Hidden(true);
        };

        const show_Cost = () => {
            setIs_Energy_vs_Cost_Hidden(true);
            setIs_Cost_Hidden(false);
            setIs_Current_vs_Power_Hidden(true);
        };

        const show_Current_vs_Power = () => {
            setIs_Energy_vs_Cost_Hidden(true);
            setIs_Cost_Hidden(true);
            setIs_Current_vs_Power_Hidden(false);
        };

        // setInterval(getData, 10000)
        // console.log(usageData)
        if (usageData != 0) {
            return (
                <>
                    {/* <SessionCheck /> */}

                    <body className="bg-light">
                        <WebHeader_V1 title={'Dashboard - Realtime Usage'} />
                        <MenuDrawer_Citizen />

                        <div className="body-topnbottom">
                            <center>
                                <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-2xl lg:text-4xl dark:text-white"> Real Time <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Usage</mark> Data </h4>
                                <br></br>
                                {/* <button type="button" onClick={show_Energy_vs_Cost} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">kWh - Unit Cost</button>
                                <button type="button" onClick={show_Cost} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Unit Cost</button>
                                <button type="button" onClick={show_Current_vs_Power} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Current - Power</button>
                                <br></br> <br></br> */}

                                {/* <ReactApexChart options={state.options} series={state.series} type="area" height={350} width={1000} /> */}
                                {/* <div className="graph-container">
                                    <div className="graph-content">
                                        <ReactApexChart
                                            options={{
                                                chart: {
                                                    id: 'apexchart-example',
                                                    height: 350,
                                                    type: 'area'
                                                },
                                                xaxis: {
                                                    type: '',
                                                    categories: timeData
                                                },
                                                dataLabels: {
                                                    enabled: false
                                                },
                                                stroke: {
                                                    curve: 'smooth'
                                                },
                                                tooltip: {
                                                    x: {
                                                        format: 'dd/MM'
                                                    },
                                                },
                                            }}
                                            series={[
                                                {
                                                    name: 'Current',
                                                    data: currentData
                                                },
                                                {
                                                    name: 'Power',
                                                    data: powerData
                                                }
                                            ]}
                                            type="area" height={500} width={1400} />
                                    </div>
                                </div> */}

                                {/* <div className="graph-container">
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

                                    {is_Current_vs_Power_Hidden ? null : (

                                        <div className="graph-content">
                                            <Chart options={OptionsChartLine} series={SeriesChartLine_Current_vs_Power} type="area" height={500} width={1400} />
                                        </div>

                                    )}
                                </div> */}

                                <div className="graph-container">
                                    <div className="power_current_container">
                                        <div className="graph-content">
                                            <Chart options={OptionsChartLine} series={SeriesChartLine_Current_vs_Power} type="area" height={400} width={900} />
                                        </div>
                                    </div>

                                    <div className="energy_cost_container">
                                        <div className="graph-content">
                                            <Chart options={OptionsChartLine} series={SeriesChartLine_Energy_vs_Cost} type="area" height={400} width={900} />
                                        </div>
                                    </div>

                                    <div className="cost_container">
                                        <div className="graph-content">
                                            <Chart options={OptionsChartLine} series={SeriesChartLine_Cost} type="area" height={400} width={900} />
                                        </div>
                                    </div>
                                </div>
                                <br></br>

                                {/* Table of Real-Time Usage Data */}
                                {/* <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table class="w-full text-sm text-center text-gray-800 dark:text-gray-400">
                                        <thead class="text-extrabold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="px-6 py-5">
                                                    Power
                                                </th>
                                                <th scope="col" class="px-6 py-5">
                                                    Current
                                                </th>
                                                <th scope="col" class="px-6 py-5">
                                                    Voltage
                                                </th>
                                                <th scope="col" class="px-6 py-5">
                                                    Time
                                                </th>
                                                <th scope="col" class="px-6 py-5">
                                                    Energy (kWh)
                                                </th>
                                                <th scope="col" class="px-6 py-5">
                                                    Unit Cost (BDT)
                                                </th>
                                                <th scope="col" class="px-6 py-5">
                                                    Citizen ID
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {usageData.map((item, index) => {
                                                const count = index + 1;
                                                return (
                                                    <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                        <td class="px-6 py-2">{item.power}</td>
                                                        <td class="px-6 py-2">{item.current}</td>
                                                        <td class="px-6 py-2">{item.voltage}</td>
                                                        <td class="px-6 py-2">{convertDate(item.time)}</td>
                                                        <td class="px-6 py-2">{energyData[index]}</td>
                                                        <td class="px-6 py-2">{costData[index]}</td>
                                                        <td class="px-6 py-2">{item.c_id}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div> */}
                            </center>
                        </div>
                    </body>
                    <WebFooter />
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

export default ViewRealTimeUsageData;