import axios from "axios";
import { useRouter } from "next/router";
import ReactApexChart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import WebHeader_V1 from "../../layout/header_v1";
import WebFooter from "../../layout/footer";
import dynamic from "next/dynamic";
import MenuDrawer_Citizen from "../../layout/citizen_menudrawer";

const ViewOtherUsageData = () => {
    const router = useRouter();

    const [usageData, setUsageData] = useState([]);
    const [powerData, setPowerData] = useState([])
    const [currentData, setCurrentData] = useState([])
    const [voltageData, setVoltageData] = useState([])
    const [timeData, setTimeData] = useState([])

    const [energyCostData, setEnergyCostData] = useState([])
    const [energyData, setEnergyData] = useState([])
    const [costData, setCostData] = useState([])
    const [energycostTimeData, setEnergyCostTimeData] = useState([])

    const [date, setDate] = useState()
    const [DataByDate, setDataByDate] = useState([])

    const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

    useEffect(() => {
        console.log("calling from useEffect")

        async function getData() {
            const powers = []
            const currents = []
            const voltages = []
            const usage_times = []

            const energies = []
            const costs = []
            const en_cost_times = []

            try {
                const response_realtime_usage = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'realtime_usage',
                    {
                        withCredentials: true
                    })
                setUsageData(response_realtime_usage.data)
                console.log("Response Realtime Usage: ", response_realtime_usage)

                const response_realtime_energycost = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'realtime_energy_cost',
                    {
                        withCredentials: true
                    })
                setEnergyCostData(response_realtime_energycost.data)
                console.log("Response Realtime Energy_Cost: ", response_realtime_energycost)

                // const timeInterval = 10
                response_realtime_usage.data.map(item_usage => {
                    console.log("Item Usage: ", item_usage)

                    currents.push(item_usage.current)

                    //Retrieving Power data and converting to kW
                    let power_kWh = (item_usage.power) / 1000
                    power_kWh = Number(power_kWh.toFixed(2))
                    powers.push(power_kWh)
                    // powers.push((item_usage.power)/1000)
                    // powers.push(item_usage.power)

                    usage_times.push(convertDate(item_usage.time))
                    // usage_times.push(item_usage.time)

                    voltages.push(item_usage.voltage)

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
                setVoltageData(voltages)
                setTimeData(usage_times)

                response_realtime_energycost.data.map(item_energycost => {
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

        getData()
        // const interval = setInterval(getData, 15000)

        // return () => clearInterval(interval)
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

    const handleDatePicker = (e) => {
        setDate(e.target.value);
    }

    const getDataByDate = async (e) => {
        e.preventDefault()

        const response_energycost_bydate = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'energy_cost/' + date, {
            withCredentials: true
        });
        setDataByDate(response_energycost_bydate.data)
        console.log("Response Energy_Cost by Date: ", response_energycost_bydate)
    }

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

    // const showData = () => {
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

    // setInterval(getData, 20000)
    // console.log(usageData)
    // if (usageData != 0) {

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

                        <div className="graph-container-customer-realtime-energycost">
                            <div className="power_current_container">
                                <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Current vs Power</span>
                                <div className="graph-content">
                                    <Chart options={OptionsChartLine} series={SeriesChartLine_Current_vs_Power} type="area" height={400} width={900} />
                                </div>
                            </div>

                            <div className="energy_cost_container">
                                <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Energy vs Cost</span>
                                <div className="graph-content">
                                    <Chart options={OptionsChartLine} series={SeriesChartLine_Energy_vs_Cost} type="area" height={400} width={900} />
                                </div>
                            </div>

                            <div className="cost_container">
                                <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Cost</span>
                                <div className="graph-content">
                                    <Chart options={OptionsChartLine} series={SeriesChartLine_Cost} type="area" height={400} width={900} />
                                </div>
                            </div>
                        </div>
                        <br></br>
                    </center>
                </div>
            </body>
            <WebFooter />
        </>

    )
};

export default ViewOtherUsageData;